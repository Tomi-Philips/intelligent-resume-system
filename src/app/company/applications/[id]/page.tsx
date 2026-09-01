import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { normalizeApplication } from '@/types/database';
import { ApplicationReviewClient } from './ApplicationReviewClient';
import { evaluateCandidateResume } from '@/lib/ai/grok';

interface ApplicationReviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ApplicationReviewPage({ params }: ApplicationReviewPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/company/applications/${id}`);
  }

  // Fetch application
  const { data: appData, error: appError } = await supabase
    .from('applications')
    .select('*, job:jobs(*, company:companies(*)), job_seeker:profiles(*), resume:resumes(*), ai_analysis:ai_analyses(*)')
    .eq('id', id)
    .single();

  if (appError || !appData) {
    notFound();
  }

  let app = normalizeApplication(appData);

  // Authorization check: Verify that user owns the company that published this job
  const { data: company } = await supabase
    .from('companies')
    .select('id, user_id')
    .eq('user_id', user.id)
    .single();

  if (!company || company.id !== app.company_id) {
    redirect('/company/dashboard');
  }

  // Self-healing: If ai_analysis is missing (e.g. from previous upload error), generate and save it
  if (!app.ai_analysis && app.job) {
    const resumeText = app.resume?.extracted_text || '';
    const evaluation = await evaluateCandidateResume({
      resumeText,
      jobTitle: app.job.title,
      jobDescription: app.job.description,
      requiredSkills: app.job.required_skills || [],
      preferredSkills: app.job.preferred_skills || [],
      experienceYearsRequired: Number(app.job.experience_years_required) || 0,
    });

    const adminSupabase = createAdminClient();
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

  return <ApplicationReviewClient application={app} />;
}

