import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { JobApplication, normalizeApplication } from '@/types/database';
import { Badge } from '@/components/ui/Badge';
import { ScorePill } from '@/components/ui/ScorePill';
import { ArrowLeft } from 'lucide-react';

export default async function AdminApplicationsPage() {
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

  const { data: appsData } = await supabase
    .from('applications')
    .select('*, job:jobs(*, company:companies(*)), job_seeker:profiles(*), ai_analysis:ai_analyses(*)')
    .order('submitted_at', { ascending: false });

  const applications = (appsData || []).map(normalizeApplication);

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
          All Screened Applications ({applications.length})
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          System-wide record of candidate submissions and automated AI screening scores.
        </p>
      </div>

      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Candidate</th>
              <th className="py-3 px-4">Position</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">AI Match</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {applications.map((app) => {
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
                <tr key={app.id} className="hover:bg-zinc-50/70">
                  <td className="py-3.5 px-4 font-bold text-zinc-900">
                    {app.job_seeker?.full_name || 'Candidate'}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-700 font-medium">
                    {app.job?.title}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-600">
                    {app.job?.company?.name || 'Company'}
                  </td>
                  <td className="py-3.5 px-4">
                    {app.ai_analysis ? (
                      <ScorePill score={score} size="sm" />
                    ) : (
                      <span className="text-zinc-400 italic">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={statusVariant} size="sm">
                      {app.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right text-zinc-400">
                    {new Date(app.submitted_at).toLocaleDateString()}
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
