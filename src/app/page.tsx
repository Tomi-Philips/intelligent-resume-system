import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Job } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowRight,
  Search,
  MapPin,
  Clock,
  Users,
  LayoutDashboard,
  Sparkles,
  Building2,
} from 'lucide-react';

export default async function HomePage() {
  const supabase = await createClient();

  let recentJobs: Job[] = [];
  let dashboardHref = '/login';
  let isLoggedIn = false;

  try {
    const { data } = await supabase
      .from('jobs')
      .select('*, company:companies(*)')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) recentJobs = data as Job[];
  } catch {
    // Fallback if db is not connected yet
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      isLoggedIn = true;
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'company') {
        dashboardHref = '/company/dashboard';
      } else if (profile?.role === 'admin') {
        dashboardHref = '/admin/dashboard';
      } else {
        dashboardHref = '/dashboard';
      }
    }
  } catch {
    // Not logged in
  }

  return (
    <div className="flex flex-col">
      {/* Hero — clean, no noisy gradients */}
      <section className="border-b border-zinc-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-medium text-zinc-600 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
            <span>Smarter hiring decisions, faster</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 tracking-tight leading-tight max-w-3xl mx-auto">
            Find the right talent.
            <br />
            Hire with data-backed confidence.
          </h1>

          <p className="mt-5 text-base text-zinc-600 max-w-xl mx-auto leading-relaxed">
            A recruitment platform for modern hiring teams. Streamline your process, manage applicants, and make informed hiring decisions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {isLoggedIn ? (
              <Link href={dashboardHref}>
                <Button size="lg">
                  <LayoutDashboard className="w-4 h-4" />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button size="lg">
                  Get Started Free
                </Button>
              </Link>
            )}
            <Link href="/jobs">
              <Button variant="secondary" size="lg">
                <Search className="w-4 h-4" />
                Browse Vacancies
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works — 4-step recruitment workflow */}
      <section className="border-b border-zinc-100 bg-zinc-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-md mx-auto mb-12">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Core Workflow
            </h2>
            <p className="text-xl font-bold text-zinc-900 tracking-tight mt-1">
              How the platform works
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            <div className="bg-white p-6 rounded-xl border border-zinc-200/80 shadow-2xs">
              <span className="text-xs font-mono text-zinc-400 font-semibold">01</span>
              <h3 className="text-sm font-bold text-zinc-900 mt-2">Company posts job</h3>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                Define the role, required technical skills, experience requirements, and qualifications.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-zinc-200/80 shadow-2xs">
              <span className="text-xs font-mono text-zinc-400 font-semibold">02</span>
              <h3 className="text-sm font-bold text-zinc-900 mt-2">Candidates apply</h3>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                Job seekers discover vacancies and securely upload their CV in PDF or DOCX format.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-zinc-200/80 shadow-2xs">
              <span className="text-xs font-mono text-zinc-400 font-semibold">03</span>
              <h3 className="text-sm font-bold text-zinc-900 mt-2">Candidate screening</h3>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                Review each application against your job requirements to assess qualifications and fit.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-zinc-200/80 shadow-2xs">
              <span className="text-xs font-mono text-zinc-400 font-semibold">04</span>
              <h3 className="text-sm font-bold text-zinc-900 mt-2">Rank & decide</h3>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                Review a ranked list of applicants, read the screening rationale for each, and move the right candidates forward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="border-b border-zinc-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                Latest Available Positions
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Explore open positions from verified companies
              </p>
            </div>
            <Link href="/jobs" className="text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
              View all positions →
            </Link>
          </div>

          {recentJobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recentJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <div className="h-full p-5 border border-zinc-200 rounded-xl bg-white shadow-2xs hover:bg-zinc-50/70 hover:shadow-md transition-all group flex flex-col justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </span>
                        <Badge variant="neutral" size="sm">
                          {job.employment_type}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-600 flex items-center gap-1.5">
                        {job.company?.logo_url ? (
                          <span className="relative w-4 h-4 rounded overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={job.company.logo_url} alt="" className="w-full h-full object-contain" />
                          </span>
                        ) : (
                          <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                        {job.company?.name || 'Company'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-zinc-400">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {job.experience_years_required}+ yrs
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-600 transition-colors shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
              <Users className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-zinc-900">No active vacancies right now</h3>
              <p className="text-xs text-zinc-500 mt-1">Companies are preparing new opportunities.</p>
              <Link href="/signup">
                <Button variant="secondary" size="sm" className="mt-4">
                  Create a Company Account & Post
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-zinc-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Ready to streamline your recruitment process?
          </h2>
          <p className="mt-2.5 text-xs text-zinc-600 max-w-md mx-auto leading-relaxed">
            Create an account in minutes to post vacancies, screen applicants, and make informed hiring decisions with full visibility into each candidate.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            {isLoggedIn ? (
              <Link href={dashboardHref}>
                <Button>
                  <LayoutDashboard className="w-4 h-4" />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button>Get Started Free</Button>
              </Link>
            )}
            <Link href="/jobs">
              <Button variant="secondary">Browse Jobs</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
