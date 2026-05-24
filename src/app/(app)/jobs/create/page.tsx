import React from 'react';
import { JobForm } from '@/components/jobs/JobForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Briefcase, Sparkles, ArrowLeft, Zap, FileText, Target, Clock } from 'lucide-react';
import Link from 'next/link';

export default function CreateJobPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-[#090A0F] dark:via-[#0F1117] dark:to-[#0A0C10]">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px] dark:bg-blue-600/10 animate-pulse-slow" />
        <div className="absolute bottom-0 -right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-[120px] dark:bg-purple-600/10 animate-pulse-slow-delayed" />
        <div className="absolute top-1/3 left-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/5 to-indigo-500/5 blur-3xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5kb2QiPjxwYXRoIGQ9Ik0zMCAzMG0tMjkgMGEyOSAyOSAwIDEgMCA1OCAwQTI5IDI5IDAgMSAwIDMwIDMweiIgc3Ryb2tlPSIjMjIyIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] bg-repeat opacity-[0.02] dark:opacity-[0.03]" />
      </div>

      <div className="relative z-10 container mx-auto py-8 px-4 max-w-4xl">
        {/* Back Navigation */}
        <Link 
          href="/jobs" 
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group mb-6"
        >
          <div className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:border-slate-300 dark:group-hover:border-white/20 transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span className="text-sm font-medium">Back to Jobs</span>
        </Link>

        {/* Header Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Briefcase className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Job Creation</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
                Create New Job
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                Define the role to find the best matching candidates with AI precision
              </p>
            </div>
            
            {/* AI Tip Badge */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">AI-Powered Matching</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl">
            {[
              { step: 1, title: 'Basic Info', icon: FileText, active: true },
              { step: 2, title: 'Requirements', icon: Target, active: false },
              { step: 3, title: 'Review', icon: Zap, active: false },
            ].map((step, idx) => (
              <React.Fragment key={step.step}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step.active 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    step.active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={`flex-1 h-0.5 mx-4 rounded-full transition-all duration-300 ${
                    step.active ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="border-0 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 bg-white/90 dark:bg-[#111318]/90 backdrop-blur-xl rounded-2xl overflow-hidden">
          {/* Decorative Top Bar */}
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <CardHeader className="pb-4 pt-8 px-8">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
                  Job Details
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400 mt-1.5 text-base">
                  The more specific the description and skills, the better the AI can score resumes
                </CardDescription>
              </div>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Estimated 5 min</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <JobForm />
          </CardContent>
        </Card>

        {/* Tips Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/5 to-transparent border border-blue-500/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-500" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">AI Optimization</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Use specific keywords and required skills for better candidate matching accuracy
            </p>
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/5 to-transparent border border-emerald-500/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-emerald-500" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Clear Requirements</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              List must-have vs nice-to-have skills to filter candidates effectively
            </p>
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/5 to-transparent border border-purple-500/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-purple-500" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Instant Analysis</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our AI will start matching candidates as soon as you post the job
            </p>
          </div>
        </div>

        {/* Demo Notice (if applicable) */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            ⚡ Your job posting will be live immediately and start attracting AI-matched candidates
          </p>
        </div>
      </div>

    </div>
  );
}