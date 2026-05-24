import React from 'react';
import { candidateService } from '@/services/candidate.service';
import { ScoreBadge } from '@/components/ai/ScoreBadge';
import { Clock, CheckCircle2, XCircle, RefreshCw, ArrowRight, Sparkles, UserPlus, TrendingUp, Eye } from 'lucide-react';
import Link from 'next/link';

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending:     <Clock className="w-3 h-3" />,
  reviewing:   <RefreshCw className="w-3 h-3" />,
  shortlisted: <CheckCircle2 className="w-3 h-3" />,
  rejected:    <XCircle className="w-3 h-3" />,
};

const STATUS_COLOR: Record<string, string> = {
  pending:     'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400',
  reviewing:   'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400',
  shortlisted: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400',
  rejected:    'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending Review',
  reviewing: 'In Review',
  shortlisted: 'Shortlisted',
  rejected: 'Rejected',
};

export async function ActivityFeed({ supabase }: { supabase?: any }) {
  let candidates: Awaited<ReturnType<typeof candidateService.getAllCandidates>> = [];
  
  try {
    candidates = await candidateService.getAllCandidates(supabase);
  } catch (e) {
    console.error('ActivityFeed fetch error:', e);
  }

  const recent = candidates.slice(0, 6);

  // Calculate stats for the header
  const totalCandidates = candidates.length;
  const avgScore = candidates.length > 0
    ? Math.floor(candidates.reduce((acc, c) => acc + (c.score || 0), 0) / candidates.length)
    : 0;
  const shortlisted = candidates.filter(c => c.status?.toLowerCase() === 'shortlisted').length;

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Recent Activity</p>
            <p className="text-xs text-slate-400">{totalCandidates} total candidates</p>
          </div>
        </div>
        <div className="flex gap-3 text-xs">
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900 dark:text-white">{avgScore}%</p>
            <p className="text-[10px] text-slate-400">Avg Match</p>
          </div>
          <div className="w-px bg-slate-200 dark:bg-slate-700" />
          <div className="text-center">
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{shortlisted}</p>
            <p className="text-[10px] text-slate-400">Shortlisted</p>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {recent.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity yet</p>
            <p className="text-xs text-slate-400 mt-1">Upload resumes to see activity here</p>
          </div>
        )}
        
        {recent.map((c, index) => {
          const status = (c.status ?? 'pending').toLowerCase();
          const score = c.score ?? 0;
          
          // Get gradient based on score
          const getScoreGradient = () => {
            if (score >= 80) return 'from-emerald-500 to-teal-500';
            if (score >= 60) return 'from-blue-500 to-indigo-500';
            return 'from-rose-500 to-pink-500';
          };
          
          return (
            <Link key={c.id} href={`/candidates/${c.id}`}>
              <div className="group relative flex items-center gap-4 p-3 rounded-xl hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent dark:hover:from-white/5 dark:hover:to-transparent transition-all duration-300 cursor-pointer animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                {/* Animated Border on Hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
                </div>
                
                {/* Avatar with Score Indicator */}
                <div className="relative shrink-0">
                  <div 
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-lg bg-gradient-to-br ${getScoreGradient()}`}
                  >
                    {c.name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  {/* Score ring indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${getScoreGradient()}`} />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {c.name ?? 'Unknown Candidate'}
                    </p>
                    {score >= 80 && (
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                    )}
                  </div>
                  {c.job_title && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">{c.job_title}</p>
                  )}
                  {/* Time indicator could be added when available */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <p className="text-[10px] text-slate-400">
                      ID: {c.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>

                {/* Score + Status */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <ScoreBadge score={c.score} size="md" />
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium border ${STATUS_COLOR[status] ?? STATUS_COLOR.pending} whitespace-nowrap`}>
                    {STATUS_ICON[status]}
                    <span>{STATUS_LABEL[status] || status}</span>
                  </span>
                </div>

                {/* Hover Arrow */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      {/* View All Link */}
      {candidates.length > 6 && (
        <Link 
          href="/candidates" 
          className="inline-flex items-center justify-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors pt-2 border-t border-slate-100 dark:border-slate-800 w-full py-3 group"
        >
          <span>View all {candidates.length} candidates</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      )}

    </div>
  );
}