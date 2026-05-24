'use client';

import React, { useState, useTransition } from 'react';
import { candidateService } from '@/services/candidate.service';
import { ChevronDown, CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

const STATUS_OPTIONS = [
  { value: 'pending',     label: 'Pending',     icon: Clock,        color: 'text-amber-600  bg-amber-50  border-amber-200  dark:bg-amber-500/10  dark:text-amber-400' },
  { value: 'reviewing',   label: 'Reviewing',   icon: RefreshCw,    color: 'text-blue-600   bg-blue-50   border-blue-200   dark:bg-blue-500/10   dark:text-blue-400' },
  { value: 'shortlisted', label: 'Shortlisted', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400' },
  { value: 'rejected',    label: 'Rejected',    icon: XCircle,      color: 'text-rose-600   bg-rose-50   border-rose-200   dark:bg-rose-500/10   dark:text-rose-400' },
] as const;

interface StatusSelectorProps {
  candidateId: string;
  initialStatus: string;
}

export function StatusSelector({ candidateId, initialStatus }: StatusSelectorProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus.toLowerCase());
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const current = STATUS_OPTIONS.find((s) => s.value === status) ?? STATUS_OPTIONS[0];
  const Icon = current.icon;

  const handleChange = (newStatus: string) => {
    setOpen(false);
    if (newStatus === status) return;
    const prev = status;
    setStatus(newStatus);
    startTransition(async () => {
      try {
        await candidateService.updateStatus(candidateId, newStatus as any);
        router.refresh();
      } catch {
        setStatus(prev);
      }
    });
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-90 ${current.color}`}
      >
        <Icon className="w-4 h-4" />
        {current.label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 top-full mt-2 left-0 min-w-[160px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {STATUS_OPTIONS.map((opt) => {
              const Ico = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleChange(opt.value)}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    status === opt.value ? 'bg-slate-50 dark:bg-slate-800' : ''
                  }`}
                >
                  <Ico className={`w-4 h-4 ${opt.color.split(' ')[0]}`} />
                  {opt.label}
                  {status === opt.value && <span className="ml-auto text-blue-500">✓</span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
