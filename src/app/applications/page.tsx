import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { JobApplication, normalizeApplication } from '@/types/database';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScorePill } from '@/components/ui/ScorePill';
import { EmptyState } from '@/components/ui/EmptyState';
import { Briefcase, ArrowRight, Building2, MapPin, ArrowLeft } from 'lucide-react';

export default async function CandidateApplicationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/applications');
  }

  const { data } = await supabase
    .from('applications')
    .select('*, job:jobs(*, company:companies(*)), ai_analysis:ai_analyses(*)')
    .eq('job_seeker_id', user.id)
    .order('submitted_at', { ascending: false });

  const applications = (data || []).map(normalizeApplication);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            My Job Applications
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Review status updates and AI screening evaluations for all your submitted positions.
          </p>
        </div>
        <Link href="/jobs">
          <Button size="sm">Explore More Vacancies</Button>
        </Link>
      </div>

      {applications.length > 0 ? (
        <div className="space-y-4">
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
              <Card key={app.id} hoverEffect className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-zinc-900">
                        {app.job?.title || 'Job Position'}
                      </h3>
                      <Badge variant={statusVariant} size="sm">
                        {app.status.toUpperCase()}
                      </Badge>
                    </div>

                    <p className="text-xs text-zinc-600 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                      {app.job?.company?.name || 'Company'}
                      {app.job?.location && (
                        <>
                          <span className="text-zinc-300">·</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-zinc-400" /> {app.job.location}
                          </span>
                        </>
                      )}
                    </p>

                    <p className="text-[11px] text-zinc-400">
                      Submitted on {new Date(app.submitted_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                    {app.ai_analysis && (
                      <ScorePill score={score} size="md" />
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
          description="Browse available job vacancies to submit your resume for automated screening."
          actionLabel="Browse Vacancies"
          actionHref="/jobs"
        />
      )}
    </div>
  );
}
