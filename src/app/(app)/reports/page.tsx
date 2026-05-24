import React from 'react';
import { candidateService } from '@/services/candidate.service';
import { jobService } from '@/services/job.service';
import { ReportsClient } from './ReportsClient';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const supabase = await createSupabaseServerClient();
  const [candidates, jobs] = await Promise.all([
    candidateService.getAllCandidates(supabase),
    jobService.getJobs(supabase)
  ]);

  return <ReportsClient candidates={candidates} jobs={jobs} />;
}