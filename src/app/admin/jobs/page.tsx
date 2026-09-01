import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Job } from '@/types/database';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Building2 } from 'lucide-react';

export default async function AdminJobsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (currentProfile?.role !== 'admin') {
    redirect('/dashboard');
  }

  const { data: jobsData } = await supabase
    .from('jobs')
    .select('*, company:companies(*), applications:applications(count)')
    .order('created_at', { ascending: false });

  const jobs = (jobsData || []) as (Job & { applications: { count: number }[] })[];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to admin dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          All Platform Vacancies ({jobs.length})
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Monitor jobs created across all organizations on the platform.
        </p>
      </div>

      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Job Title</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Applicants</th>
              <th className="py-3 px-4 text-right">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {jobs.map((job) => {
              const appCount = job.applications?.[0]?.count || 0;
              return (
                <tr key={job.id} className="hover:bg-zinc-50/70">
                  <td className="py-3.5 px-4 font-bold text-zinc-900">
                    <Link href={`/jobs/${job.id}`} className="hover:text-blue-600 hover:underline">
                      {job.title}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-600 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                    {job.company?.name || 'Company'}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-500">{job.location}</td>
                  <td className="py-3.5 px-4 text-zinc-500">{job.employment_type}</td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={job.status === 'published' ? 'success' : 'neutral'}
                      size="sm"
                    >
                      {job.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-zinc-800">{appCount}</td>
                  <td className="py-3.5 px-4 text-right text-zinc-400">
                    {new Date(job.created_at).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
