import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Company, Job } from '@/types/database';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Briefcase,
  PlusCircle,
  Users,
  Clock,
  MapPin,
  ArrowRight,
  Edit,
  ArrowLeft,
} from 'lucide-react';

export default async function CompanyJobsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/company/jobs');
  }

  const { data: companyData } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  const company = companyData as Company | null;

  if (!company) {
    redirect('/company/profile');
  }

  const { data: jobsData } = await supabase
    .from('jobs')
    .select('*, applications:applications(count)')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false });

  const jobs = (jobsData || []) as (Job & { applications: { count: number }[] })[];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/company/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to company dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Manage Vacancies
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Create, publish, edit, and review candidate rankings for all your company job openings.
          </p>
        </div>

        <Link href="/company/jobs/create">
          <Button size="sm">
            <PlusCircle className="w-3.5 h-3.5" /> Post New Job
          </Button>
        </Link>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {jobs.map((job) => {
            const appCount = job.applications?.[0]?.count || 0;
            return (
              <div
                key={job.id}
                className="p-5 sm:p-6 border border-zinc-200 rounded-xl bg-white shadow-2xs hover:bg-zinc-50/50 hover:shadow-md transition-all flex flex-col justify-between gap-3"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-base font-bold text-zinc-900 hover:text-blue-600 transition-colors"
                    >
                      {job.title}
                    </Link>
                    <Badge
                      variant={
                        job.status === 'published'
                          ? 'success'
                          : job.status === 'closed'
                          ? 'danger'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {job.status.toUpperCase()}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {job.employment_type}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {job.experience_years_required}+ yrs
                    </span>
                    <span className="inline-flex items-center gap-1 text-zinc-700 font-semibold">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      {appCount} {appCount === 1 ? 'applicant' : 'applicants'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100">
                  <Link href={`/company/jobs/${job.id}/applicants`}>
                    <Button size="sm">
                      <Users className="w-3.5 h-3.5" />
                      Rank Candidates ({appCount})
                    </Button>
                  </Link>

                  <Link href={`/company/jobs/${job.id}/edit`}>
                    <Button variant="secondary" size="sm">
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No job openings created yet"
          description="Create your first vacancy to start receiving and screening candidate applications."
          actionLabel="Create Vacancy"
          actionHref="/company/jobs/create"
        />
      )}
    </div>
  );
}
