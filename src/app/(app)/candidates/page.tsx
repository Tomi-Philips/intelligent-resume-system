import React from 'react';
import { candidateService } from '@/services/candidate.service';
import { CandidateFilters } from '@/components/candidates/CandidateFilters';
import { Sparkles } from 'lucide-react';

import { createSupabaseServerClient } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export default async function GlobalCandidatesPage() {
  const supabase = await createSupabaseServerClient();
  let candidates: Awaited<ReturnType<typeof candidateService.getAllCandidates>> = [];

  try {
    candidates = await candidateService.getAllCandidates(supabase);
  } catch (e) {
    console.error('Candidates page fetch error:', e);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Candidate Management</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
          Candidates
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
          Browse and manage all candidates across your hiring pipelines
        </p>
      </div>

      {/* Filters + List — client component receives server data */}
      <CandidateFilters initialCandidates={candidates} />
    </div>
  );
}