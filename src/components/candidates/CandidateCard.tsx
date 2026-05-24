'use client';

import React, { useState, useTransition } from 'react';
import { CandidateWithDetails, candidateService } from '../../services/candidate.service';
import { ScoreBadge } from '../ai/ScoreBadge';
import { User, Mail, Phone, Calendar, ArrowRight, CheckCircle2, Clock, XCircle, RefreshCw, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CandidateCardProps {
  candidate: CandidateWithDetails;
}

const STATUS_CONFIG = {
  pending:    { label: 'Pending',     color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400',    icon: Clock },
  reviewing:  { label: 'Reviewing',   color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400',        icon: RefreshCw },
  shortlisted:{ label: 'Shortlisted', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400', icon: CheckCircle2 },
  rejected:   { label: 'Rejected',    color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400',         icon: XCircle },
};

export function CandidateCard({ candidate }: CandidateCardProps) {
  const router = useRouter();
  const [status, setStatus] = useState(candidate.status.toLowerCase() as keyof typeof STATUS_CONFIG);
  const [isPending, startTransition] = useTransition();

  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;

  const cycle = () => {
    const order: Array<keyof typeof STATUS_CONFIG> = ['pending', 'reviewing', 'shortlisted', 'rejected'];
    const next = order[(order.indexOf(status) + 1) % order.length];
    const prev = status;
    setStatus(next);
    startTransition(async () => {
      try {
        await candidateService.updateStatus(candidate.id, next);
        router.refresh();
      } catch {
        setStatus(prev);
      }
    });
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Score accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-all"
        style={{
          background: (candidate.score ?? 0) >= 80
            ? 'linear-gradient(90deg,#10b981,#14b8a6)'
            : (candidate.score ?? 0) >= 60
            ? 'linear-gradient(90deg,#3b82f6,#6366f1)'
            : 'linear-gradient(90deg,#f43f5e,#ec4899)',
        }}
      />

      {/* Background decor */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />

      <div className="flex justify-between items-start mb-4 pt-1">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
          {candidate.name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <ScoreBadge score={candidate.score} />
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
            {candidate.name || 'Anonymous Candidate'}
          </h3>
          {candidate.job_title && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Briefcase className="w-3 h-3" />
              {candidate.job_title}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          {candidate.email && (
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{candidate.email}</span>
            </div>
          )}
          {candidate.phone && (
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>{candidate.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Calendar className="w-3 h-3 shrink-0" />
            <span>Applied {new Date(candidate.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Skills preview */}
        {candidate.skills && candidate.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {candidate.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {skill}
              </span>
            ))}
            {candidate.skills.length > 3 && (
              <span className="px-2 py-0.5 rounded-md text-xs text-slate-400">+{candidate.skills.length - 3}</span>
            )}
          </div>
        )}

        <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={cycle}
            disabled={isPending}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:opacity-80 active:scale-95 ${cfg.color}`}
          >
            <Icon className="w-3 h-3" />
            {cfg.label}
          </button>

          <Link
            href={`/candidates/${candidate.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
          >
            View
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}