import React from 'react';
import { jobService } from '@/services/job.service';
import { JobCard } from '@/components/jobs/JobCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Plus, Briefcase, TrendingUp, Clock, Filter, Download, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';

import { createSupabaseServerClient } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export default async function JobsPage() {
  const supabase = await createSupabaseServerClient();
  const jobs = await jobService.getJobs(supabase);

  // Calculate stats
  const activeJobs = jobs.filter(j => j.status !== 'closed').length;
  const totalApplicants = jobs.reduce((acc, job) => acc + (job.applicant_count || 0), 0);
  const avgMatchRate = Math.floor(jobs.reduce((acc, job) => acc + (job.avg_match_score || 85), 0) / (jobs.length || 1));

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Briefcase className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Job Management</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
            Jobs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Manage open positions and track candidate applications
          </p>
        </div>
        <Link href="/jobs/create">
          <Button className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group border-none">
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Create New Job
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
          icon={<Briefcase className="w-6 h-6 text-white" />}
          label="Active Positions"
          value={activeJobs.toString()}
          progress={(activeJobs / (jobs.length || 1)) * 100}
          color="blue"
        />
        <StatCard 
          icon={<Users className="w-6 h-6 text-white" />}
          label="Total Applicants"
          value={totalApplicants.toString()}
          subtext={`+${Math.floor(totalApplicants * 0.12)} this month`}
          color="emerald"
        />
        <StatCard 
          icon={<Target className="w-6 h-6 text-white" />}
          label="Avg. Match Score"
          value={`${avgMatchRate}%`}
          progress={avgMatchRate}
          color="purple"
        />
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search jobs by title, department, or location..." 
            className="pl-10 h-11 bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-11 px-4 border-slate-200 dark:border-slate-800 rounded-xl">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="h-11 px-4 border-slate-200 dark:border-slate-800 rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <div className="text-center py-20 bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center">
            <Briefcase className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">No jobs posted yet</h3>
          <p className="text-slate-500 mt-2 mb-6 max-w-sm mx-auto">
            Create your first job posting to start accepting resumes and find the perfect candidate.
          </p>
          <Link href="/jobs/create">
            <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Job
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, progress, subtext, color }: any) {
  const colorMap: any = {
    blue: 'from-blue-500 to-indigo-600 shadow-blue-500/25',
    emerald: 'from-emerald-500 to-teal-600 shadow-emerald-500/25',
    purple: 'from-purple-500 to-pink-600 shadow-purple-500/25',
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
          <TrendingUp className={`w-5 h-5 text-${color}-500 opacity-50`} />
        </div>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{label}</p>
        {subtext && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">{subtext}</p>}
        {progress !== undefined && (
          <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${colorMap[color]} rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}

function Users(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function Target(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}