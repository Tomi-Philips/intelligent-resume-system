'use client';

import React, { useState, useTransition } from 'react';
import { CandidateWithDetails } from '../../services/candidate.service';
import { ScoreBadge } from '../ai/ScoreBadge';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { ChevronDown, Eye, CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react';
import { candidateService } from '../../services/candidate.service';
import { useRouter } from 'next/navigation';

interface CandidateTableProps {
  candidates: CandidateWithDetails[];
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { value: 'reviewing', label: 'Reviewing', icon: RefreshCw, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { value: 'shortlisted', label: 'Shortlisted', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-rose-600 bg-rose-50 border-rose-200' },
] as const;

function StatusCell({ candidateId, initialStatus }: { candidateId: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus.toLowerCase());
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const current = STATUS_OPTIONS.find((s) => s.value === status) ?? STATUS_OPTIONS[0];
  const Icon = current.icon;

  const handleChange = (newStatus: string) => {
    setOpen(false);
    const prev = status;
    setStatus(newStatus); // optimistic
    startTransition(async () => {
      try {
        await candidateService.updateStatus(candidateId, newStatus as any);
        router.refresh();
      } catch {
        setStatus(prev); // revert on error
      }
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${current.color} hover:opacity-90`}
      >
        <Icon className="w-3 h-3" />
        {current.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 min-w-[140px] bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {STATUS_OPTIONS.map((opt) => {
            const Ico = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => handleChange(opt.value)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                  status === opt.value ? 'bg-slate-50 dark:bg-slate-800' : ''
                }`}
              >
                <Ico className={`w-3.5 h-3.5 ${opt.color.split(' ')[0]}`} />
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CandidateTable({ candidates }: CandidateTableProps) {
  if (candidates.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm13 5v-2a4 4 0 00-3-3.87" />
          </svg>
        </div>
        <p className="text-slate-600 dark:text-slate-300 font-medium">No candidates yet</p>
        <p className="text-slate-400 text-sm mt-1">Upload resumes to start screening candidates</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wide border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="px-6 py-4">Candidate</th>
            <th className="px-6 py-4">Contact</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">AI Score</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {candidates.map((candidate) => (
            <tr
              key={candidate.id}
              className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                    {candidate.name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {candidate.name ?? 'Unknown'}
                    </p>
                    {candidate.job_title && (
                      <p className="text-xs text-slate-400 mt-0.5">{candidate.job_title}</p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                {candidate.email ?? '—'}
              </td>
              <td className="px-6 py-4">
                <StatusCell candidateId={candidate.id} initialStatus={candidate.status} />
              </td>
              <td className="px-6 py-4">
                <ScoreBadge score={candidate.score} />
              </td>
              <td className="px-6 py-4 text-right">
                <Link href={`/candidates/${candidate.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 rounded-lg opacity-70 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
