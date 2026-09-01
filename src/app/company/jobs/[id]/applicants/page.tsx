import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { Job, JobApplication, normalizeApplication } from '@/types/database';
import { ApplicantsRankingClient } from './ApplicantsRankingClient';
import { evaluateCandidateResume } from '@/lib/ai/grok';

interface ApplicantsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ApplicantsRankingPage({ params }: ApplicantsPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/company/jobs/${id}/applicants`);
  }

  // Fetch job & ensure ownership by this company
  const { data: jobData, error: jobError } = await supabase
    .from('jobs')
    .select('*, company:companies(*)')
    .eq('id', id)
    .single();

  if (jobError || !jobData) {
    notFound();
  }

  const job = jobData as Job;

  // Verify company authorization
  const { data: company } = await supabase
    .from('companies')
    .select('id, user_id')
    .eq('user_id', user.id)
    .single();

  if (!company || company.id !== job.company_id) {
    redirect('/company/dashboard');
  }

  // Fetch applications for this specific job with candidate profile, resume and AI analysis
  const { data: appsData } = await supabase
    .from('applications')
    .select('*, job_seeker:profiles(*), resume:resumes(*), ai_analysis:ai_analyses(*)')
    .eq('job_id', id);

  const adminSupabase = createAdminClient();
  const applications: JobApplication[] = [];

  for (const rawApp of (appsData || [])) {
    let app = normalizeApplication(rawApp);
    if (!app.ai_analysis) {
      const resumeText = app.resume?.extracted_text || '';
      const evaluation = await evaluateCandidateResume({
        resumeText,
        jobTitle: job.title,
        jobDescription: job.description,
        requiredSkills: job.required_skills || [],
        preferredSkills: job.preferred_skills || [],
        experienceYearsRequired: Number(job.experience_years_required) || 0,
      });

      const { data: insertedAnalysis } = await adminSupabase
        .from('ai_analyses')
        .insert({
          application_id: app.id,
          match_score: evaluation.match_score,
          found_skills: evaluation.found_skills,
          missing_skills: evaluation.missing_skills,
          experience_match: evaluation.experience_match,
          education_match: evaluation.education_match,
          strengths: evaluation.strengths,
          weaknesses: evaluation.weaknesses,
          summary: evaluation.summary,
          raw_response: evaluation.raw_response,
        })
        .select()
        .single();

      if (insertedAnalysis) {
        app = {
          ...app,
          ai_analysis: insertedAnalysis,
        };
      }
    }
    applications.push(app);
  }

  return (
    <ApplicantsRankingClient job={job} applications={applications} />
  );
}

