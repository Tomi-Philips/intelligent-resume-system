import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { JobApplication, Profile, Job, normalizeApplication } from '@/types/database';
import { isJobSeekerProfileComplete } from '@/lib/profile-completeness';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScorePill } from '@/components/ui/ScorePill';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  Search,
  ArrowRight,
  MapPin,
  Building2,
  AlertTriangle,
  User,
} from 'lucide-react';

export default async function JobSeekerDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard');
  }

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const profile = profileData as Profile;
  if (profile?.role === 'company') {
    redirect('/company/dashboard');
  } else if (profile?.role === 'admin') {
    redirect('/admin/dashboard');
  }

  const { data: appData } = await supabase
    .from('applications')
    .select('*, job:jobs(*, company:companies(*)), ai_analysis:ai_analyses(*)')
    .eq('job_seeker_id', user.id)
    .order('submitted_at', { ascending: false });

  const applications = (appData || []).map(normalizeApplication);

  // Fetch recent published jobs for recommendations sidebar
  const { data: recentJobsData } = await supabase
    .from('jobs')
    .select('*, company:companies(*)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(4);

  const recentJobs = (recentJobsData || []) as Job[];

  // KPI calculations
  const appliedCount = applications.length;
  const pendingCount = applications.filter((a) => a.status === 'pending').length;
  const reviewingCount = applications.filter((a) => a.status === 'reviewing').length;
  const shortlistedCount = applications.filter(
    (a) => a.status === 'shortlisted' || a.status === 'hired'
  ).length;

  const profileComplete = isJobSeekerProfileComplete(profile);

  const stats = [
    { label: 'Applied', value: appliedCount, icon: Briefcase, color: 'text-zinc-900' },
    { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-amber-600' },
    { label: 'Under Review', value: reviewingCount, icon: Search, color: 'text-blue-600' },
    { label: 'Shortlisted', value: shortlistedCount, icon: CheckCircle2, color: 'text-emerald-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Welcome back, {profile?.full_name || user.email?.split('@')[0] || 'Candidate'}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Track your applications, monitor AI screening assessments, and explore new roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/jobs">
            <Button size="sm">
              <Search className="w-3.5 h-3.5" /> Browse Vacancies
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="secondary" size="sm">
              <User className="w-3.5 h-3.5" /> Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Incomplete Warning Banner */}
      {!profileComplete && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                Complete your candidate profile
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Add your headline, contact number, and skills to maximize your alignment with recruiters.
              </p>
            </div>
          </div>
          <Link href="/profile">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white whitespace-nowrap text-xs">
              Complete Profile
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                {stat.label}
              </span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
            <div className="text-[11px] text-zinc-400 mt-1">
              {stat.label === 'Applied' && 'Total submissions'}
              {stat.label === 'Pending' && 'Awaiting recruiter review'}
              {stat.label === 'Under Review' && 'Actively being reviewed'}
              {stat.label === 'Shortlisted' && 'Advanced to next stage'}
            </div>
          </Card>
        ))}
      </div>

      {/* 2-Column Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Applications */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              Recent Applications
            </h2>
            {applications.length > 0 && (
              <Link href="/applications" className="text-xs font-semibold text-blue-600 hover:underline">
                View all ({applications.length}) →
              </Link>
            )}
          </div>

          {applications.length > 0 ? (
            <div className="space-y-3">
              {applications.slice(0, 5).map((app) => {
                const score = app.ai_analysis?.match_score || 0;
                const statusVariant =
                  app.status === 'shortlisted' || app.status === 'hired'
                    ? 'success'
                    : app.status === 'rejected'
                    ? 'danger'
                    : app.status === 'reviewing'
                    ? 'accent'
                    : 'warning';

                return (
                  <Card key={app.id} hoverEffect className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-zinc-900">
                            {app.job?.title || 'Job Position'}
                          </h3>
                          <Badge variant={statusVariant} size="sm">
                            {app.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-xs text-zinc-500">
                          {app.job?.company?.name || 'Company'}
                          {app.job?.location && (
                            <span className="text-zinc-300 mx-1.5">·</span>
                          )}
                          {app.job?.location}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          Applied {new Date(app.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        {app.ai_analysis && (
                          <ScorePill score={score} size="sm" />
                        )}
                        <Link href={`/applications/${app.id}`}>
                          <Button variant="secondary" size="sm">
                            View Assessment <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Briefcase}
              title="No applications submitted yet"
              description="You haven't applied to any vacancies yet. Browse open positions to submit your resume for automated screening."
              actionLabel="Browse Available Jobs"
              actionHref="/jobs"
            />
          )}
        </div>

        {/* Right Column: Latest Openings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              Recommended Roles
            </h2>
            <Link href="/jobs" className="text-xs font-semibold text-blue-600 hover:underline">
              View all →
            </Link>
          </div>

          {recentJobs.length > 0 ? (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <Card key={job.id} hoverEffect className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-xs font-bold text-zinc-900 line-clamp-1">
                      {job.title}
                    </h3>
                    <Badge variant="neutral" size="sm">
                      {job.employment_type}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 mb-2">
                    {job.company?.name || 'Company'}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-100">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {job.location}
                    </span>
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-blue-600 font-medium hover:underline flex items-center gap-0.5"
                    >
                      Apply <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center border-dashed border-zinc-200">
              <Briefcase className="w-6 h-6 text-zinc-300 mx-auto mb-2" />
              <p className="text-xs text-zinc-500">No vacancies currently posted.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
