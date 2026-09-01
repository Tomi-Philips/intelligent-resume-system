import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Job } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import {
  Search,
  MapPin,
  Clock,
  Building2,
  Briefcase,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface JobsPageProps {
  searchParams: Promise<{
    q?: string;
    location?: string;
    type?: string;
  }>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const { q = '', location = '', type = '' } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('jobs')
    .select('*, company:companies(*)')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (q) {
    query = query.ilike('title', `%${q}%`);
  }
  if (location) {
    query = query.ilike('location', `%${location}%`);
  }
  if (type) {
    query = query.eq('employment_type', type);
  }

  const { data } = await query;
  const jobs = (data || []) as Job[];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
          Browse Open Vacancies
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Explore career opportunities and submit your resume for AI-assisted screening.
        </p>
      </div>

      {/* Filter Bar */}
      <form method="GET" className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by job title or skill..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
            />
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              name="location"
              defaultValue={location}
              placeholder="Location or 'Remote'..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
            />
          </div>

          <div className="flex gap-2">
            <select
              name="type"
              defaultValue={type}
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400 text-zinc-700"
            >
              <option value="">All Employment Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            <Button type="submit" size="sm">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </Button>
          </div>
        </div>
      </form>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-zinc-500">
          Showing {jobs.length} {jobs.length === 1 ? 'vacancy' : 'vacancies'}
        </span>
        {(q || location || type) && (
          <Link href="/jobs" className="text-xs text-blue-600 hover:underline">
            Clear filters
          </Link>
        )}
      </div>

      {/* Job Listings Grid */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <div className="h-full p-5 border border-zinc-200 rounded-xl bg-white shadow-2xs hover:bg-zinc-50/70 hover:shadow-md transition-all group flex flex-col justify-between gap-3">
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
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

                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Required Skills Badges */}
                  {job.required_skills && job.required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.required_skills.slice(0, 4).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[11px]"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.required_skills.length > 4 && (
                        <span className="text-[11px] text-zinc-400 self-center">
                          +{job.required_skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {job.experience_years_required}+ yrs
                    </span>
                    {job.salary_range && (
                      <span className="text-zinc-600 font-medium">
                        {job.salary_range}
                      </span>
                    )}
                  </div>
                  <Button variant="secondary" size="sm" className="shrink-0">
                    View <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border-dashed border-zinc-200">
          <Briefcase className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-900">No jobs match your criteria</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Try adjusting your search terms or clearing selected filters.
          </p>
          <Link href="/jobs">
            <Button variant="secondary" size="sm" className="mt-4">
              View All Jobs
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
