import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Job, Profile } from '@/types/database';
import { JobDetailsClient } from './JobDetailsClient';

interface JobDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch Job details
  const { data: jobData, error: jobError } = await supabase
    .from('jobs')
    .select('*, company:companies(*)')
    .eq('id', id)
    .single();

  if (jobError || !jobData) {
    notFound();
  }

  const job = jobData as Job;

  // Check current auth user and profile
  let isLoggedIn = false;
  let currentUserProfile: Profile | null = null;
  let hasApplied = false;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    isLoggedIn = true;
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    currentUserProfile = profile as Profile;

    // Check if user has already applied for this job
    const { data: app } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', id)
      .eq('job_seeker_id', user.id)
      .maybeSingle();

    if (app) {
      hasApplied = true;
    }
  }

  return (
    <JobDetailsClient
      job={job}
      isLoggedIn={isLoggedIn}
      currentUserProfile={currentUserProfile}
      hasApplied={hasApplied}
    />
  );
}
