import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { JobApplication, normalizeApplication } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ScorePill } from '@/components/ui/ScorePill';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Sparkles,
  Award,
  BookOpen,
  Info,
} from 'lucide-react';

interface ApplicationDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/applications/${id}`);
  }

  const { data, error } = await supabase
    .from('applications')
    .select('*, job:jobs(*, company:companies(*)), resume:resumes(*), ai_analysis:ai_analyses(*)')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  const app = normalizeApplication(data);

  // Authorization check: User must be the applicant or admin
  if (app.job_seeker_id !== user.id) {
    redirect('/dashboard');
  }

  const analysis = app.ai_analysis;
  const score = analysis?.match_score || 0;

  const statusVariant =
    app.status === 'shortlisted' || app.status === 'hired'
      ? 'success'
      : app.status === 'rejected'
      ? 'danger'
      : app.status === 'reviewing'
      ? 'accent'
      : 'warning';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/applications"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to all applications
      </Link>

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-zinc-200 shadow-2xs mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                {app.job?.title}
              </h1>
              <Badge variant={statusVariant}>
                {app.status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-zinc-600 flex items-center gap-1.5">
              {app.job?.company?.logo_url ? (
                <span className="relative w-5 h-5 rounded-md overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0 flex items-center justify-center">
                  <Image
                    src={app.job.company.logo_url}
                    alt={`${app.job.company.name} logo`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </span>
              ) : (
                <Building2 className="w-3.5 h-3.5 text-zinc-400" />
              )}
              {app.job?.company?.name || 'Company'}
              {app.job?.location && (
                <>
                  <span className="text-zinc-300">·</span>
                  <MapPin className="w-3 h-3 text-zinc-400" />
                  <span>{app.job.location}</span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {analysis && (
              <ScorePill score={score} size="lg" />
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-zinc-100 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>Applied: {new Date(app.submitted_at).toLocaleDateString()}</span>
          </div>
          {app.resume && (
            <div className="text-zinc-400">
              Resume: <span className="font-medium text-zinc-700">{app.resume.file_name}</span>
            </div>
          )}
        </div>
      </div>

      {/* AI Screening Assessment Breakdown */}
      {analysis ? (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <Card className="p-6 sm:p-8 space-y-3 bg-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                AI Match Assessment Summary
              </h2>
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed">
              {analysis.summary}
            </p>
          </Card>

          {/* Matched & Missing Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-5 space-y-3 border-emerald-200/70 bg-emerald-50/20">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Matching Technical Skills ({analysis.found_skills?.length || 0})
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {analysis.found_skills && analysis.found_skills.length > 0 ? (
                  analysis.found_skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-white border border-emerald-200 text-emerald-800 rounded-md text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-zinc-400 italic">None specifically identified.</p>
                )}
              </div>
            </Card>

            <Card className="p-5 space-y-3 border-amber-200/70 bg-amber-50/20">
              <div className="flex items-center gap-2 text-amber-800">
                <XCircle className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Skills Requiring Growth ({analysis.missing_skills?.length || 0})
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {analysis.missing_skills && analysis.missing_skills.length > 0 ? (
                  analysis.missing_skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-white border border-amber-200 text-amber-800 rounded-md text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-zinc-400 italic">No missing skills detected.</p>
                )}
              </div>
            </Card>
          </div>

          {/* Strengths & Weaknesses Evaluation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-zinc-900">
                <Award className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Candidate Strengths
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-zinc-600">
                {analysis.strengths && analysis.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-zinc-900">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Considerations & Gaps
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-zinc-600">
                {analysis.weaknesses && analysis.weaknesses.map((weak, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold shrink-0">•</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Transparency Disclaimer */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex items-start gap-3 text-xs text-zinc-500">
            <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-zinc-700">AI Decision-Support Notice:</strong> This evaluation was generated using natural language processing techniques and transformer language models to compare resume content with vacancy specifications. Hiring managers review all applications directly.
            </p>
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center border-dashed">
          <Sparkles className="w-8 h-8 text-zinc-400 mx-auto mb-2 animate-pulse" />
          <h3 className="text-sm font-semibold text-zinc-900">Analysis in progress</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Your resume is currently being screened by the AI engine. Please check back shortly.
          </p>
        </Card>
      )}
    </div>
  );
}
