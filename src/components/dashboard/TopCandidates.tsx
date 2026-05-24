import React from 'react';
import { candidateService } from '@/services/candidate.service';
import { ScoreBadge } from '@/components/ai/ScoreBadge';
import { Award, ArrowRight, Sparkles, Crown, Medal, TrendingUp, Star, Zap } from 'lucide-react';
import Link from 'next/link';

export async function TopCandidates({ supabase }: { supabase?: any }) {
  let candidates: Awaited<ReturnType<typeof candidateService.getAllCandidates>> = [];

  try {
    candidates = await candidateService.getAllCandidates(supabase);
  } catch (e) {
    console.error('TopCandidates fetch error:', e);
  }

  const top = candidates.slice(0, 5);

  // Calculate average score of top candidates
  const topAvgScore = top.length > 0
    ? Math.floor(top.reduce((acc, c) => acc + (c.score || 0), 0) / top.length)
    : 0;

  const rankConfig = [
    { icon: Crown, color: 'from-amber-400 to-yellow-500', label: 'Top Performer', glow: 'shadow-amber-500/30' },
    { icon: Medal, color: 'from-slate-300 to-slate-400', label: 'Runner Up', glow: 'shadow-slate-400/30' },
    { icon: Award, color: 'from-amber-600 to-orange-700', label: 'Bronze', glow: 'shadow-amber-700/30' },
    { icon: Star, color: 'from-blue-400 to-blue-500', label: 'Rising Star', glow: 'shadow-blue-500/30' },
    { icon: Sparkles, color: 'from-indigo-400 to-indigo-500', label: 'Honorable', glow: 'shadow-indigo-500/30' },
  ];

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
            <Award className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Top Candidates</p>
            <p className="text-xs text-slate-400">Highest match scores</p>
          </div>
        </div>
        {top.length > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <TrendingUp className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
              Avg: {topAvgScore}%
            </span>
          </div>
        )}
      </div>

      {/* Top Candidates List */}
      <div className="space-y-2">
        {top.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">No candidates yet</p>
            <p className="text-xs text-slate-400 mt-1">Upload resumes to see top matches</p>
          </div>
        )}
        
        {top.map((c, i) => {
          const score = c.score ?? 0;
          const config = rankConfig[i];
          const Icon = config.icon;
          
          // Get gradient based on score
          const getScoreGradient = () => {
            if (score >= 80) return 'from-emerald-500 to-teal-500';
            if (score >= 60) return 'from-blue-500 to-indigo-500';
            return 'from-amber-500 to-orange-500';
          };
          
          return (
            <Link key={c.id} href={`/candidates/${c.id}`}>
              <div className="group relative flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent dark:hover:from-white/5 dark:hover:to-transparent transition-all duration-300 cursor-pointer animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                {/* Rank Badge with Icon */}
                <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ${config.glow}`}>
                  <Icon className="w-5 h-5 text-white" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-[9px] font-bold text-slate-700 shadow-sm">
                    {i + 1}
                  </div>
                </div>

                {/* Avatar with Status Indicator */}
                <div className="relative shrink-0">
                  <div 
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-lg bg-gradient-to-br ${getScoreGradient()}`}
                  >
                    {c.name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  {/* Online indicator (for demonstration) */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {c.name ?? 'Unknown Candidate'}
                    </p>
                    {score >= 90 && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                        <Zap className="w-2 h-2" />
                        EXCEPTIONAL
                      </span>
                    )}
                  </div>
                  {c.job_title && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">{c.job_title}</p>
                  )}
                  {/* Score bar visible on hover */}
                  <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${getScoreGradient()}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono">{score}%</span>
                  </div>
                </div>

                {/* Score Badge */}
                <div className="shrink-0">
                  <ScoreBadge score={c.score} size="md" />
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
      {candidates.length > 5 && (
        <Link 
          href="/candidates" 
          className="inline-flex items-center justify-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors pt-3 border-t border-slate-100 dark:border-slate-800 w-full py-3 group"
        >
          <span>View all {candidates.length} candidates</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      )}

      {/* Achievement Note */}
      {top.length > 0 && (top[0].score ?? 0) >= 90 && (
        <div className="mt-3 p-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
              🎉 Great news! Your top candidate is an exceptional match.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}