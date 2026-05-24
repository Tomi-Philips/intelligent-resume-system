// src/app/api/resumes/upload/route.ts
import { NextResponse } from 'next/server';
import { createClient as createSupabase } from '@supabase/supabase-js';
import mammoth from 'mammoth';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // <-- must match .env

export async function POST(req: Request) {
  try {
    const supabase = createSupabase(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const jobId = formData.get('jobId') as string;

    if (!file || !jobId) {
      return NextResponse.json({ error: 'Missing file or jobId' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${jobId}/${fileName}`;

    // ---- 1️⃣ Store file in Supabase ----
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, buffer, { contentType: file.type, upsert: true });

    if (uploadError) throw uploadError;

    // ---- 2️⃣ Extract raw text ----
    let rawText = '';
    
    // Create a mock module.parent to prevent pdf-parse from running its test code
    const originalParent = module.parent;
    Object.defineProperty(module, 'parent', { value: null, writable: true, configurable: true });
    
    try {
      if (file.type === 'application/pdf') {
        const pdfParse = await import('pdf-parse');
        const pdfData = await pdfParse(buffer);
        rawText = pdfData.text;
      }
    } finally {
      // Restore original module.parent
      if (originalParent) {
        Object.defineProperty(module, 'parent', { value: originalParent, writable: true, configurable: true });
      }
    }

    if (!rawText) {
      if (
        file.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.endsWith('.docx')
      ) {
        const { value } = await mammoth.extractRawText({ buffer });
        rawText = value;
      } else {
        rawText = 'Unsupported format for text extraction.';
      }
    }

    // ---- 3️⃣ Persist resume metadata ----
    const { data: resumeData, error: resumeError } = await supabase
      .from('resumes')
      .insert({ job_id: jobId, file_path: filePath, file_name: file.name, raw_text: rawText })
      .select()
      .single();

    if (resumeError) throw resumeError;

    // ---- 4️⃣ AI analysis (fallback works out‑of‑the‑box) ----
    const { data: jobData } = await supabase
      .from('jobs')
      .select('description, title')
      .eq('id', jobId)
      .single();

    const { aiService } = await import('@/services/ai.service');
    const aiResults = await aiService.analyzeResume(
      `Job Title: ${jobData.title}\nDescription: ${jobData.description}`,
      rawText
    );

    // ---- 5️⃣ Create candidate record ----
    const candidateName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const { data: candidateData, error: candidateError } = await supabase
      .from('candidates')
      .insert({
        job_id: jobId,
        resume_id: resumeData.id,
        name: candidateName,
        status: 'pending',
        score: aiResults.score,
        match_breakdown: {
          found: aiResults.found_skills,
          missing: aiResults.missing_skills,
          summary: aiResults.summary,
        },
      })
      .select()
      .single();

    if (candidateError) throw candidateError;

    return NextResponse.json({
      success: true,
      resumeId: resumeData.id,
      candidateId: candidateData?.id,
      aiProcessed: aiResults.score > 0,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}