import React, { Suspense } from 'react';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { TopCandidates } from '@/components/dashboard/TopCandidates';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import { SuperAdminDashboard } from '@/components/dashboard/SuperAdminDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { jobService } from '@/services/job.service';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Briefcase, ArrowRight, Activity, Plus, Trophy, ShieldAlert } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#111318]/80 border border-slate-100 dark:border-slate-800 p-6 animate-pulse">
      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4" />
      <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg mb-2" />
      <div className="h-4 w-28 bg-slate-100 dark:bg-slate-800 rounded" />
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-20" />
          </div>
          <div className="w-14 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role = 'user';
  let status = 'active';

  if (user) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, status')
        .eq('id', user.id)
        .single();
        
      if (profile) {
        role = profile.role ?? 'user';
        status = profile.status ?? 'active';
      } else {
        role = user.user_metadata?.role ?? 'user';
      }
    } catch (err) {
      console.error('Error fetching user profile in dashboard page:', err);
      role = user.user_metadata?.role ?? 'user';
    }
  }

  // Handle suspended state
  if (status === 'suspended') {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full border border-rose-200 dark:border-rose-500/20 shadow-2xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden text-center p-8">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto mb-4 animate-bounce">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Account Suspended</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
            Your account has been locked or suspended by the system administrator. If you believe this is an error, please contact Support.
          </p>
          <div className="mt-6 border-t border-slate-100 dark:border-slate-800/60 pt-6 flex flex-col gap-3">
            <p className="text-xs text-slate-400">
              You may still access Settings to delete your credentials if you wish to exit the platform.
            </p>
            <Link href="/settings" className="w-full">
              <Button variant="outline" className="w-full rounded-xl border-slate-200 dark:border-slate-800">
                Go to Account Settings
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Handle Super Admin
  if (role === 'super_admin') {
    return <SuperAdminDashboard />;
  }

  // Handle Candidate (User)
  if (role === 'user') {
    return <UserDashboard />;
  }

  // Default Recruiter View
  let recentJobs: Awaited<ReturnType<typeof jobService.getJobs>> = [];
  try {
    recentJobs = await jobService.getJobs(supabase);
  } catch (e) {
    console.error('Dashboard jobs fetch error:', e);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Live Dashboard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Real-time overview of your hiring pipelines</p>
        </div>
        <Link href="/jobs/create">
          <Button className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/25 border-none gap-2 transition-all duration-300">
            <Plus className="w-4 h-4" />
            New Job
          </Button>
        </Link>
      </div>

      {/* Live Stats with Suspense skeleton */}
      <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div>}>
        <StatsCards supabase={supabase} />
      </Suspense>

      {/* Activity + Top Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Recent Candidates</CardTitle>
                  <p className="text-xs text-slate-400 mt-0.5">Latest additions to your pipeline</p>
                </div>
              </div>
              <Link href="/candidates" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<SkeletonList />}><ActivityFeed supabase={supabase} /></Suspense>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Top Candidates</CardTitle>
                  <p className="text-xs text-slate-400 mt-0.5">Highest AI match scores</p>
                </div>
              </div>
              <Link href="/candidates" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<SkeletonList />}><TopCandidates supabase={supabase} /></Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Active Jobs */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Active Jobs</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">{recentJobs.length} position{recentJobs.length !== 1 ? 's' : ''} open</p>
              </div>
            </div>
            <Link href="/jobs" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentJobs.length === 0 ? (
            <div className="text-center py-10">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No jobs yet</p>
              <Link href="/jobs/create">
                <Button variant="ghost" className="mt-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/10 gap-1.5 rounded-xl">
                  <Plus className="w-4 h-4" />Create your first job
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.slice(0, 4).map((job) => (
                <div key={job.id} className="group flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-200">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{job.title}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">{job.status ?? 'open'}</span>
                    </div>
                    {job.experience_level && <p className="text-xs text-slate-400">{job.experience_level}</p>}
                  </div>
                  <Link href={`/jobs/${job.id}`}>
                    <Button variant="outline" size="sm" className="rounded-lg border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-xs gap-1.5 transition-all">
                      Manage <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}