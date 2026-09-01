import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Company, Job, JobApplication, normalizeApplication } from '@/types/database';
import { isCompanyProfileComplete } from '@/lib/profile-completeness';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScorePill } from '@/components/ui/ScorePill';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  Building2,
  AlertTriangle,
} from 'lucide-react';

export default async function CompanyDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/company/dashboard');
  }

  // Fetch company profile
  const { data: companyData } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  const company = companyData as Company | null;

  if (!company) {
    redirect('/company/profile');
  }

  // Profile completeness check
  const profileComplete = isCompanyProfileComplete(company);

  // Fetch company jobs
  const { data: jobsData } = await supabase
    .from('jobs')
    .select('*, applications:applications(count)')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false });

  const jobs = (jobsData || []) as (Job & { applications: { count: number }[] })[];

  // Fetch all applications submitted to company's jobs
  const { data: appsData } = await supabase
    .from('applications')
    .select('*, job:jobs(*), job_seeker:profiles(*), ai_analysis:ai_analyses(*)')
    .eq('company_id', company.id)
    .order('submitted_at', { ascending: false });

  const applications = (appsData || []).map(normalizeApplication);

  // Real KPIs calculated directly from DB records
  const activeJobsCount = jobs.filter((j) => j.status === 'published').length;
  const totalApplicantsCount = applications.length;
  const pendingReviewCount = applications.filter((a) => a.status === 'pending').length;
  const shortlistedCount = applications.filter(
    (a) => a.status === 'shortlisted' || a.status === 'hired'
  ).length;

  const stats = [
    { label: 'Active Jobs', value: activeJobsCount, icon: Briefcase, color: 'text-zinc-900' },
    { label: 'Total Applicants', value: totalApplicantsCount, icon: Users, color: 'text-blue-600' },
    { label: 'Pending Review', value: pendingReviewCount, icon: Clock, color: 'text-amber-600' },
    { label: 'Shortlisted', value: shortlistedCount, icon: CheckCircle2, color: 'text-emerald-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            {company.name} Dashboard
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage vacancies, evaluate applicants with AI screening, and rank candidates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/company/jobs/create">
            <Button size="sm">
              <PlusCircle className="w-3.5 h-3.5" /> Post New Job
            </Button>
          </Link>
          <Link href="/company/profile">
            <Button variant="secondary" size="sm">
              <Building2 className="w-3.5 h-3.5" /> Company Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Incomplete Profile Alert */}
      {!profileComplete && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                Complete your company profile
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Provide your company description and official contact details before publishing vacancies.
              </p>
            </div>
          </div>
          <Link href="/company/profile">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white whitespace-nowrap text-xs">
              Complete Profile
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Stats */}
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
              {stat.label === 'Active Jobs' && 'Published vacancies'}
              {stat.label === 'Total Applicants' && 'Total submissions'}
              {stat.label === 'Pending Review' && 'Awaiting your evaluation'}
              {stat.label === 'Shortlisted' && 'Top candidate matches'}
            </div>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Applicants Requiring Review */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              Recent Candidate Submissions
            </h2>
            {applications.length > 0 && (
              <span className="text-xs text-zinc-400 font-medium">
                {applications.length} total applicants
              </span>
            )}
          </div>

          {applications.length > 0 ? (
            <div className="space-y-3">
              {applications.slice(0, 6).map((app) => {
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
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-zinc-900">
                            {app.job_seeker?.full_name || 'Candidate'}
                          </h3>
                          <Badge variant={statusVariant} size="sm">
                            {app.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-xs text-zinc-500">
                          Applied for: <span className="font-medium text-zinc-700">{app.job?.title}</span>
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          Applied {new Date(app.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        {app.ai_analysis && (
                          <ScorePill score={score} size="sm" />
                        )}
                        <Link href={`/company/applications/${app.id}`}>
                          <Button variant="secondary" size="sm">
                            Review Applicant <ArrowRight className="w-3.5 h-3.5" />
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
              icon={Users}
              title="No candidate applications yet"
              description="Publish a vacancy to begin receiving candidate submissions with automated AI screening."
              actionLabel="Post a Vacancy"
              actionHref="/company/jobs/create"
            />
          )}
        </div>

        {/* Right Column: Your Vacancies */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              Your Vacancies
            </h2>
            <Link href="/company/jobs" className="text-xs font-semibold text-blue-600 hover:underline">
              Manage All →
            </Link>
          </div>

          {jobs.length > 0 ? (
            <div className="space-y-3">
              {jobs.slice(0, 5).map((job) => {
                const appCount = job.applications?.[0]?.count || 0;
                return (
                  <Card key={job.id} hoverEffect className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-bold text-zinc-900 line-clamp-1">
                        {job.title}
                      </h3>
                      <Badge
                        variant={job.status === 'published' ? 'success' : 'neutral'}
                        size="sm"
                      >
                        {job.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100">
                      <span>{appCount} {appCount === 1 ? 'applicant' : 'applicants'}</span>
                      <Link
                        href={`/company/jobs/${job.id}/applicants`}
                        className="text-blue-600 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                      >
                        Rankings <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-6 text-center border-dashed border-zinc-200">
              <Briefcase className="w-6 h-6 text-zinc-300 mx-auto mb-2" />
              <p className="text-xs text-zinc-500 mb-3">You haven&apos;t posted any jobs yet.</p>
              <Link href="/company/jobs/create">
                <Button size="sm" className="w-full">
                  Post Your First Job
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
