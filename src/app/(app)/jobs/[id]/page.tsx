import React from 'react';
import { jobService } from '@/services/job.service';
import { candidateService } from '@/services/candidate.service';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CandidateTable } from '@/components/candidates/CandidateTable';
import { JobDescriptionAnalyzer } from '@/components/jobs/JobDescriptionAnalyzer';
import Link from 'next/link';
import { 
  UploadCloud, 
  Users, 
  ArrowLeft, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  Target,
  Sparkles,
  Award,
  Clock,
  Zap,
  FileText,
  CheckCircle2
} from 'lucide-react';

import { createSupabaseServerClient } from '@/lib/supabaseServer';

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = params instanceof Promise ? await params : params;
  const supabase = await createSupabaseServerClient();
  const job = await jobService.getJobById(id, supabase);
  const candidates = await candidateService.getCandidatesByJob(id, supabase);

  if (!job) {
    notFound();
  }

  // Calculate stats
  const topMatchScore = candidates.length > 0 
    ? Math.max(...candidates.map(c => c.score || 0))
    : 0;
  const averageScore = candidates.length > 0
    ? Math.floor(candidates.reduce((acc, c) => acc + (c.score || 0), 0) / candidates.length)
    : 0;
  const shortlistedCount = candidates.filter(c => c.status === 'Shortlisted').length;

  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <Link 
        href="/jobs" 
        className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group mb-2"
      >
        <div className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:border-slate-300 dark:group-hover:border-slate-700 transition-all">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        </div>
        <span className="text-sm font-medium">Back to Jobs</span>
      </Link>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Briefcase className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Job Details</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
            {job.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {job.experience_level && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                <TrendingUp className="w-3.5 h-3.5" />
                {job.experience_level}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
              <Calendar className="w-3.5 h-3.5" />
              Posted {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Zap className="w-3.5 h-3.5" />
              Active
            </span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Link href={`/jobs/${job.id}/upload`}>
            <Button className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/25 border-none group">
              <UploadCloud className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
              Upload Resumes
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-6 h-6 text-white" />} label="Total Applicants" value={candidates.length.toString()} color="blue" />
        <StatCard icon={<Award className="w-6 h-6 text-white" />} label="Top Match Score" value={`${topMatchScore}%`} color="emerald" />
        <StatCard icon={<TrendingUp className="w-6 h-6 text-white" />} label="Average Match" value={`${averageScore}%`} color="purple" />
        <StatCard icon={<CheckCircle2 className="w-6 h-6 text-white" />} label="Shortlisted" value={shortlistedCount.toString()} color="amber" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left Column - Job Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-black/50 bg-white dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Job Description</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed text-base">
                {job.description}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-black/50 bg-white dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-500" />
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Required Skills</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2.5">
                {job.required_skills.length > 0 ? (
                  job.required_skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20"
                    >
                      <Sparkles className="w-3 h-3" />
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic">No specific skills listed.</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-black/50 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl overflow-hidden text-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-lg shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">AI Matching Active</h4>
                  <p className="text-xs text-blue-50/70 leading-relaxed">
                    Candidates are automatically scored based on how well their skills match this job.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-black/50 bg-white dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-sm text-slate-500">Created</span>
                <span className="text-sm font-medium">{new Date(job.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-500">Last Updated</span>
                <span className="text-sm font-medium">{new Date(job.updated_at || job.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* JD Quality Analyzer */}
          <JobDescriptionAnalyzer
            requiredSkills={job.required_skills ?? []}
            experienceLevel={job.experience_level}
            description={job.description ?? ''}
          />
        </div>
      </div>

      {/* Candidates Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
            AI-Ranked Applicants
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Candidates sorted by match score against your job requirements
          </p>
        </div>
        <CandidateTable candidates={candidates} />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  const colorMap: any = {
    blue: 'from-blue-500 to-indigo-600',
    emerald: 'from-emerald-500 to-teal-600',
    purple: 'from-purple-500 to-pink-600',
    amber: 'from-amber-500 to-orange-600',
  };

  return (
    <Card className="border-0 shadow-lg shadow-slate-200/30 dark:shadow-black/30 bg-white dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden p-5">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-lg shrink-0`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">{label}</p>
        </div>
      </div>
    </Card>
  );
}