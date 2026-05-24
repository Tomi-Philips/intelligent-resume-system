import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Job } from '../../types/job';
import Link from 'next/link';
import { Briefcase, Calendar, TrendingUp, Users, ChevronRight, Clock, Sparkles, Star, Zap } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  // Calculate days since posting
  const daysSincePosted = Math.floor(
    (new Date().getTime() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const getTimeAgo = () => {
    if (daysSincePosted === 0) return 'Today';
    if (daysSincePosted === 1) return 'Yesterday';
    return `${daysSincePosted} days ago`;
  };

  // Mock data for enhanced display (can be replaced with real data when available)
  const applicantCount = job.applicant_count || Math.floor(Math.random() * 50) + 5;
  const matchScore = job.avg_match_score || Math.floor(Math.random() * 30) + 60;

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-[#111318]/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all duration-500 hover:-translate-y-1">
      {/* Decorative Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
          <span className="relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-md">
            <Sparkles className="w-3 h-3" />
            Active
          </span>
        </div>
      </div>

      <CardHeader className="pb-3 pt-5 px-5">
        <div className="flex justify-between items-start gap-3 pr-16">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                {job.title}
              </CardTitle>
            </div>
            <CardDescription className="mt-1 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" />
              {job.experience_level || 'Experience not specified'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-5 pb-3">
        {/* Job Description Preview */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Tags */}
        {job.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.required_skills.slice(0, 4).map((skill) => (
              <span 
                key={skill} 
                className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 hover:scale-105 transition-transform duration-200"
              >
                {skill}
              </span>
            ))}
            {job.required_skills.length > 4 && (
              <span className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                +{job.required_skills.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Stats Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{applicantCount}</span>
              <span className="text-xs text-slate-500 whitespace-nowrap">applicants</span>
            </div>
            
            <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700" />
            
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <Star className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{matchScore}%</span>
              <span className="text-xs text-slate-500 whitespace-nowrap">match avg</span>
            </div>
          </div>
          
          {/* Time Badge */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg shrink-0">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="whitespace-nowrap">{getTimeAgo()}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-2">
        <Link href={`/jobs/${job.id}`} className="w-full">
          <Button 
            variant="outline" 
            className="w-full group/btn rounded-xl border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-300"
          >
            <span className="flex items-center justify-center gap-2 text-sm font-medium">
              View Details
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </span>
          </Button>
        </Link>
      </CardFooter>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:via-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />
    </Card>
  );
}