import React from 'react';
import { candidateService } from '@/services/candidate.service';
import { RankingVisualizer } from '@/components/ai/RankingVisualizer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { 
  BarChart3, Users, CheckCircle2, Clock, XCircle, RefreshCw,
  Briefcase, TrendingUp, Award, Target
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType; bg: string }> = {
  pending:     { label: 'Pending',     color: 'text-amber-600',  icon: Clock,        bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30' },
  reviewing:   { label: 'Reviewing',   color: 'text-blue-600',   icon: RefreshCw,    bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30' },
  shortlisted: { label: 'Shortlisted', color: 'text-emerald-600',icon: CheckCircle2, bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' },
  rejected:    { label: 'Rejected',    color: 'text-rose-600',   icon: XCircle,      bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30' },
};

export default async function AnalyticsPage() {
  let analytics = {
    scoreDistribution: [
      { range: '0-20', count: 0 },
      { range: '21-40', count: 0 },
      { range: '41-60', count: 0 },
      { range: '61-80', count: 0 },
      { range: '81-100', count: 0 },
    ],
    statusBreakdown: [] as { status: string; count: number }[],
    topJobs: [] as { title: string; avgScore: number; candidateCount: number }[],
    recentCandidates: [] as any[],
  };

  try {
    const supabase = await createSupabaseServerClient();
    analytics = await candidateService.getAnalyticsData(supabase);
  } catch (e) {
    console.error('Analytics page fetch error:', e);
  }

  const totalCandidates = analytics.statusBreakdown.reduce((a, b) => a + b.count, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
          <BarChart3 className="w-3.5 h-3.5 text-purple-500" />
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Live Analytics</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
          Insights
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
          Real-time analytics on your hiring pipeline
        </p>
      </div>

      {/* Top summary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalCandidates}</p>
              <p className="text-sm text-slate-500 mt-0.5">Total Candidates</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {analytics.statusBreakdown.find((s) => s.status === 'shortlisted')?.count ?? 0}
              </p>
              <p className="text-sm text-slate-500 mt-0.5">Shortlisted</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {analytics.topJobs[0]?.avgScore ?? 0}%
              </p>
              <p className="text-sm text-slate-500 mt-0.5">Best Job Avg Score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score Distribution + Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Distribution */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Score Distribution</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">AI match scores across all candidates</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <RankingVisualizer scoreDistribution={analytics.scoreDistribution} />
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Pipeline Breakdown</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">Candidates by current status</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const entry = analytics.statusBreakdown.find((s) => s.status === key);
              const count = entry?.count ?? 0;
              const pct = totalCandidates > 0 ? Math.round((count / totalCandidates) * 100) : 0;
              const Icon = cfg.icon;
              return (
                <div key={key} className="flex items-center gap-3">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border w-28 shrink-0 ${cfg.bg} ${cfg.color}`}>
                    <Icon className="w-3 h-3" />
                    {cfg.label}
                  </div>
                  <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-8 text-right">{count}</span>
                </div>
              );
            })}
            {analytics.statusBreakdown.length === 0 && (
              <p className="text-center text-slate-400 text-sm py-6">No candidates yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Jobs by Score */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Top Performing Jobs</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Ranked by average candidate match score</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {analytics.topJobs.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-8">No job data yet. Create jobs and upload resumes.</p>
          ) : (
            <div className="space-y-4">
              {analytics.topJobs.map((job, i) => (
                <div key={job.title} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-800 dark:text-white">{job.title}</span>
                  </div>
                  <div className="ml-auto flex items-center gap-4">
                    <span className="text-xs text-slate-400">{job.candidateCount} candidate{job.candidateCount !== 1 ? 's' : ''}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                          style={{ width: `${job.avgScore}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${job.avgScore >= 70 ? 'text-emerald-600' : job.avgScore >= 50 ? 'text-blue-600' : 'text-rose-600'}`}>
                        {job.avgScore}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
