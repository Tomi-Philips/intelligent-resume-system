import React from 'react';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { notFound } from 'next/navigation';
import { ScoreBadge } from '@/components/ai/ScoreBadge';
import { SkillExtractor } from '@/components/ai/SkillExtractor';
import { RecruiterNotes } from '@/components/candidates/RecruiterNotes';
import { StatusSelector } from '@/components/candidates/StatusSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Phone, Sparkles, FileText,
  Award, TrendingUp, Calendar, StickyNote
} from 'lucide-react';

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = params instanceof Promise ? await params : params;
  const supabase = await createSupabaseServerClient();

  // ── Fetch candidate record ────────────────────────────────────────────────
  const { data: candidate, error: candidateError } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', id)
    .single();

  if (candidateError) {
    if (candidateError.code === 'PGRST116') notFound();
    console.error('Error fetching candidate:', JSON.stringify(candidateError));
    notFound();
  }

  if (!candidate) notFound();

  // ── Fetch linked resume ───────────────────────────────────────────────────
  let resume: Record<string, any> | null = null;
  if (candidate.resume_id) {
    const { data: rData } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', candidate.resume_id)
      .single();
    resume = rData;
  }

  // ── Fetch notes ───────────────────────────────────────────────────────────
  const { data: notesData } = await supabase
    .from('notes')
    .select('*')
    .eq('candidate_id', id)
    .order('created_at', { ascending: false });

  // ── Render helpers ────────────────────────────────────────────────────────
  const matchBreakdown = (candidate.match_breakdown ?? {}) as {
    found?: string[];
    missing?: string[];
    summary?: string;
  };

  const formattedDate = candidate.created_at
    ? new Date(candidate.created_at).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    : 'Unknown';

  const score = candidate.score ?? 0;
  const scoreColor =
    score >= 80 ? 'from-emerald-500 to-teal-500'
    : score >= 60 ? 'from-blue-500 to-indigo-500'
    : 'from-rose-500 to-pink-500';

  const notes = (notesData ?? []) as Array<{
    id: string; candidate_id: string; user_id: string | null;
    content: string; created_at: string;
  }>;

  return (
    <div className="space-y-8">
      {/* Back navigation */}
      <Link
        href={`/jobs/${candidate.job_id}`}
        className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
      >
        <div className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:border-slate-300 dark:group-hover:border-slate-700 transition-all">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        </div>
        <span className="text-sm font-medium">Back to Job Candidates</span>
      </Link>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8 shadow-2xl">
        <div className={`absolute top-0 right-0 w-72 h-72 bg-gradient-to-br ${scoreColor} opacity-10 rounded-full blur-3xl`} />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${scoreColor} flex items-center justify-center text-white text-3xl font-bold shadow-2xl shrink-0`}>
              {candidate.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 mb-2">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span className="text-xs font-medium text-blue-300">Candidate Profile</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {candidate.name ?? 'Unnamed Candidate'}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                {candidate.email && (
                  <span className="flex items-center gap-1.5 text-sm text-slate-300">
                    <Mail className="w-4 h-4 text-blue-400" />
                    {candidate.email}
                  </span>
                )}
                {candidate.phone && (
                  <span className="flex items-center gap-1.5 text-sm text-slate-300">
                    <Phone className="w-4 h-4 text-blue-400" />
                    {candidate.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-sm text-slate-400">
                  <Calendar className="w-4 h-4" />
                  Applied {formattedDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <ScoreBadge score={score} size="lg" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Status:</span>
              <StatusSelector candidateId={candidate.id} initialStatus={candidate.status} />
            </div>
          </div>
        </div>
      </div>

      {/* Score progress bar */}
      <div className="flex items-center gap-4 px-1">
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 w-24 shrink-0">Match Score</span>
        <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${scoreColor} transition-all duration-1000`}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 w-12 text-right">{score}%</span>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left — AI Analysis + Skills */}
        <div className="space-y-6">
          {matchBreakdown.summary && (
            <Card className="border-0 shadow-xl bg-white dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-500" />
                  </div>
                  <CardTitle className="text-lg font-bold">AI Recruiter Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {matchBreakdown.summary}
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="border-0 shadow-xl bg-white dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <CardTitle className="text-lg font-bold">Skill Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {matchBreakdown.found || matchBreakdown.missing ? (
                <SkillExtractor
                  foundSkills={(matchBreakdown.found ?? []) as string[]}
                  missingSkills={(matchBreakdown.missing ?? []) as string[]}
                />
              ) : (
                <p className="text-slate-400 italic text-sm text-center py-8">
                  No AI skill analysis available. Re-upload the resume to trigger analysis.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-500" />
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <StickyNote className="w-5 h-5 text-purple-500" />
                </div>
                <CardTitle className="text-lg font-bold">Recruiter Notes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <RecruiterNotes candidateId={candidate.id} initialNotes={notes} />
            </CardContent>
          </Card>
        </div>

        {/* Right — Resume text */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl bg-white dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-amber-500" />
                  </div>
                  <CardTitle className="text-lg font-bold">Resume Content</CardTitle>
                </div>
                {resume?.file_name && (
                  <span className="text-xs text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                    {resume.file_name}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {resume?.raw_text ? (
                <div className="max-h-[600px] overflow-y-auto pr-2 scroll-smooth">
                  <pre className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400 font-mono leading-relaxed">
                    {resume.raw_text}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-400 italic text-sm">No resume text extracted.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
