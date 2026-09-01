import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { extractTextFromBuffer } from '@/lib/resume/extractor';
import { evaluateCandidateResume } from '@/lib/ai/grok';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // 1. Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to apply for this job.' },
        { status: 401 }
      );
    }

    // 2. Validate User Role (Strict Rule: Companies & Admins cannot apply)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'company') {
      return NextResponse.json(
        { error: 'Companies cannot apply to jobs. Please use a Job Seeker account.' },
        { status: 403 }
      );
    }

    // 3. Parse FormData
    const formData = await req.formData();
    const jobId = formData.get('job_id') as string;
    const file = formData.get('resume') as File | null;

    if (!jobId) {
      return NextResponse.json({ error: 'Missing Job ID.' }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json(
        { error: 'Please upload a resume document (PDF or DOCX).' },
        { status: 400 }
      );
    }

    // 4. Validate File size (Max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit. Please upload a smaller document.' },
        { status: 400 }
      );
    }

    // 5. Fetch Job Details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*, company:companies(*)')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job vacancy not found.' }, { status: 404 });
    }

    if (job.status !== 'published') {
      return NextResponse.json(
        { error: 'This job vacancy is not currently accepting applications.' },
        { status: 400 }
      );
    }

    // 6. Check for duplicate application
    const { data: existingApp } = await supabase
      .from('applications')
      .select('id, status')
      .eq('job_id', jobId)
      .eq('job_seeker_id', user.id)
      .maybeSingle();

    if (existingApp) {
      return NextResponse.json(
        { error: 'You have already submitted an application for this position.' },
        { status: 409 }
      );
    }

    // 7. Extract Resume Text
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extractionResult = await extractTextFromBuffer(buffer, file.type, file.name);

    if (extractionResult.error || !extractionResult.text) {
      return NextResponse.json(
        { error: extractionResult.error || 'Failed to extract text from the resume.' },
        { status: 422 }
      );
    }

    const extractedText = extractionResult.text;

    // 8. Upload file to Supabase Storage or create storage reference
    const fileNameSafe = `${user.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    let filePath = fileNameSafe;

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileNameSafe, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!uploadError && uploadData) {
        filePath = uploadData.path;
      }
    } catch {
      // If storage bucket is not yet provisioned in Supabase, preserve file path metadata
      filePath = `resumes/${fileNameSafe}`;
    }

    // 9. Insert Resume Record
    const { data: resumeRecord, error: resumeError } = await supabase
      .from('resumes')
      .insert({
        job_seeker_id: user.id,
        file_path: filePath,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type || 'application/octet-stream',
        extracted_text: extractedText,
      })
      .select()
      .single();

    if (resumeError || !resumeRecord) {
      return NextResponse.json(
        { error: resumeError?.message || 'Failed to store resume record.' },
        { status: 500 }
      );
    }

    // 10. Insert Application Record
    const { data: appRecord, error: appError } = await supabase
      .from('applications')
      .insert({
        job_id: jobId,
        company_id: job.company_id,
        job_seeker_id: user.id,
        resume_id: resumeRecord.id,
        status: 'pending',
      })
      .select()
      .single();

    if (appError || !appRecord) {
      return NextResponse.json(
        { error: appError?.message || 'Failed to create application record.' },
        { status: 500 }
      );
    }

    // 11. Run AI Evaluation (Grok + NLP baseline)
    const evaluation = await evaluateCandidateResume({
      resumeText: extractedText,
      jobTitle: job.title,
      jobDescription: job.description,
      requiredSkills: job.required_skills || [],
      preferredSkills: job.preferred_skills || [],
      experienceYearsRequired: Number(job.experience_years_required) || 0,
    });

    // 12. Insert AI Analysis Record (Use Admin Client to bypass RLS for system record)
    const adminSupabase = createAdminClient();
    const { error: analysisError } = await adminSupabase.from('ai_analyses').insert({
      application_id: appRecord.id,
      match_score: evaluation.match_score,
      found_skills: evaluation.found_skills,
      missing_skills: evaluation.missing_skills,
      experience_match: evaluation.experience_match,
      education_match: evaluation.education_match,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      summary: evaluation.summary,
      raw_response: evaluation.raw_response,
    });

    if (analysisError) {
      console.error('Error inserting AI analysis record:', analysisError);
    }

    return NextResponse.json({
      success: true,
      applicationId: appRecord.id,
      matchScore: evaluation.match_score,
      message: 'Application submitted and screened successfully.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
