import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { jobService } from '@/services/job.service';
import { notFound } from 'next/navigation';
import { ResumeUploader } from '@/components/resumes/ResumeUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  Sparkles,
  Zap,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// ── Build a minimal Supabase server client (inline to avoid supabaseServer indirection bugs) ──
async function getSupabase() {
  const cookieStore = await cookies();
  const cookieList   = cookieStore.getAll();
  console.log('[UPLOAD] cookies:', cookieList.length, cookieList.map(c => c.name).join(', ') || '(none)');

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()  { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {/* ServerComponents can't write cookies — ignored */ }
        },
      },
    },
  );
}

export default async function UploadResumesPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = params instanceof Promise ? await params : params;
  console.log('[UPLOAD] START jobId:', id);

  let supabase: Awaited<ReturnType<typeof getSupabase>>;
  try {
    supabase = await getSupabase();
    console.log('[UPLOAD] Supabase client OK');
  } catch (e: any) {
    console.error('[UPLOAD] Supabase client FAILED:', e.message);
    throw e;
  }

  // Raw query first — bypass jobService to isolate the failure point
  const { data: rawJob, error: rawError } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();
  console.log('[UPLOAD] raw query:', { title: rawJob?.title ?? 'null', error: rawError?.code ?? 'none' });

  const job = await jobService.getJobById(id, supabase);
  console.log('[UPLOAD] getJobById:', job?.title ?? 'NULL');

  if (!job) {
    console.error('[UPLOAD] NOT FOUND — aborting');
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-[#090A0F] dark:via-[#0F1117] dark:to-[#0A0C10]">

      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 -right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px] dark:bg-blue-600/10 animate-pulse-slow" />
        <div className="absolute bottom-0 -left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-[120px] dark:bg-purple-600/10 animate-pulse-slow-delayed" />
        <div className="absolute top-1/3 left-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/5 to-indigo-500/5 blur-3xl" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5kb2QiPjxwYXRoIGQ9Ik0zMCAzMG0tMjkgMGEyOSAyOSAwIDEgMCA1OCAwQTI5IDI5IDAgMSAwIDMwIDMweiIgc3Ryb2tlPSIjMjIyIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] bg-repeat opacity-[0.02] dark:opacity-[0.03]" />
      </div>

      <div className="relative z-10 container mx-auto py-8 px-4 max-w-5xl">
        {/* Back Navigation */}
        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group mb-6"
        >
          <div className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:border-slate-300 dark:group-hover:border-white/20 transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span className="text-sm font-medium">Back to Job Details</span>
        </Link>

        {/* Header Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <UploadCloud className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Resume Upload</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
                Upload Resumes
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-slate-500 dark:text-slate-400 text-lg">
                  Uploading candidates for
                </p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                  <FileText className="w-3.5 h-3.5" />
                  {job.title}
                </span>
              </div>
            </div>

            {/* AI Badge */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">AI-Powered Parsing</span>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-500/5 to-transparent border border-blue-500/10">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Instant Parsing</h4>
              <p className="text-xs text-slate-500 mt-0.5">Extract text and skills from PDFs instantly</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-500/5 to-transparent border border-emerald-500/10">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">AI Skill Extraction</h4>
              <p className="text-xs text-slate-500 mt-0.5">Automatically find and match skills in every resume</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-500/5 to-transparent border border-purple-500/10">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Secure Storage</h4>
              <p className="text-xs text-slate-500 mt-0.5">All resumes are encrypted and stored safely</p>
            </div>
          </div>
        </div>

        {/* Main Upload Card */}
        <Card className="border-0 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 bg-white/90 dark:bg-[#111318]/90 backdrop-blur-xl rounded-2xl overflow-hidden">
          {/* Decorative Top Bar */}
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <CardHeader className="pb-4 pt-8 px-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
                    Batch Upload
                  </CardTitle>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <Clock className="w-3 h-3" />
                    Fast Processing
                  </span>
                </div>
                <CardDescription className="text-slate-500 dark:text-slate-400 text-base">
                  Upload multiple resumes at once. Our AI will automatically parse the text, extract skills,
                  and score them against the job requirements.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <ResumeUploader jobId={job.id} />
          </CardContent>
        </Card>

        {/* Tips Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-500/10">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Supported Formats</h4>
                <p className="text-xs text-slate-500 mt-1">
                  We support PDF, DOCX, and TXT files. Each file should be less than 10MB.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-r from-blue-500/5 to-transparent border border-blue-500/10">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Best Practices</h4>
                <p className="text-xs text-slate-500 mt-1">
                  For better parsing accuracy, ensure resumes are clearly formatted with standard sections like Work Experience, Education, and Skills.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" />
            Your files are secure and will be deleted after processing
          </p>
        </div>
      </div>

    </div>
  );
}
