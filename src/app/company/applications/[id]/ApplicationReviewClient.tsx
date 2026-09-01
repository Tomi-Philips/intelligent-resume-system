'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { JobApplication, ApplicationStatus } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ScorePill } from '@/components/ui/ScorePill';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
  FileText,
  Save,
  Info,
} from 'lucide-react';

interface ApplicationReviewClientProps {
  application: JobApplication;
}

export function ApplicationReviewClient({ application }: ApplicationReviewClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const [notes, setNotes] = useState(application.notes || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showRawResume, setShowRawResume] = useState(false);

  const candidate = application.job_seeker;
  const analysis = application.ai_analysis;
  const score = analysis?.match_score || 0;

  const handleUpdateStatusAndNotes = async (newStatus?: ApplicationStatus) => {
    setIsUpdating(true);
    setSaveSuccess(false);

    const targetStatus = newStatus || status;

    try {
      const { error } = await supabase
        .from('applications')
        .update({
          status: targetStatus,
          notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', application.id);

      if (!error) {
        setStatus(targetStatus);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
        router.refresh();
      } else {
        alert(error.message);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update application');
    } finally {
      setIsUpdating(false);
    }
  };

  const statusVariant =
    status === 'shortlisted' || status === 'hired'
      ? 'success'
      : status === 'rejected'
      ? 'danger'
      : status === 'reviewing'
      ? 'accent'
      : 'warning';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Link
        href={`/company/jobs/${application.job_id}/applicants`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to candidate rankings
      </Link>

      {/* Candidate Header Summary */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-zinc-200 shadow-2xs mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                {candidate?.full_name || 'Candidate Review'}
              </h1>
              <Badge variant={statusVariant}>
                {status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-zinc-500">
              Applying for <span className="font-semibold text-zinc-700">{application.job?.title}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {analysis && <ScorePill score={score} size="lg" />}
          </div>
        </div>

        {/* Contact info bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-100 text-xs text-zinc-600">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
            <span>{candidate?.email || 'Email not provided'}</span>
          </div>
          {candidate?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>{candidate.phone}</span>
            </div>
          )}
          {candidate?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>{candidate.location}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: AI Evaluation & Resume Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Assessment Breakdown */}
          {analysis && (
            <div className="space-y-6">
              {/* Executive Summary */}
              <Card className="p-6 space-y-3 bg-white">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    AI Match Assessment Summary
                  </h2>
                </div>
                <p className="text-xs text-zinc-700 leading-relaxed">
                  {analysis.summary}
                </p>
              </Card>

              {/* Matching vs Missing Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-5 space-y-3 border-emerald-200 bg-emerald-50/20">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      Matching Skills ({analysis.found_skills?.length || 0})
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysis.found_skills?.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-white border border-emerald-200 text-emerald-800 rounded-md text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {(!analysis.found_skills || analysis.found_skills.length === 0) && (
                      <span className="text-xs text-zinc-400 italic">None identified</span>
                    )}
                  </div>
                </Card>

                <Card className="p-5 space-y-3 border-amber-200 bg-amber-50/20">
                  <div className="flex items-center gap-2 text-amber-800">
                    <XCircle className="w-4 h-4 text-amber-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      Missing Skills ({analysis.missing_skills?.length || 0})
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysis.missing_skills?.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-white border border-amber-200 text-amber-800 rounded-md text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {(!analysis.missing_skills || analysis.missing_skills.length === 0) && (
                      <span className="text-xs text-zinc-400 italic">No missing skills detected</span>
                    )}
                  </div>
                </Card>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-zinc-900">
                    <Award className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      Strengths & Fit
                    </h3>
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-600">
                    {analysis.strengths?.map((str, i) => (
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
                      Weaknesses & Skill Gaps
                    </h3>
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-600">
                    {analysis.weaknesses?.map((weak, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold shrink-0">•</span>
                        <span>{weak}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {/* Extracted Resume Text Drawer */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-600" />
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  Submitted Resume: {application.resume?.file_name}
                </h3>
              </div>
              <button
                onClick={() => setShowRawResume(!showRawResume)}
                className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
              >
                {showRawResume ? 'Collapse Resume Text' : 'View Extracted Text'}
              </button>
            </div>

            {showRawResume && (
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-700 font-mono whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
                {application.resume?.extracted_text || 'No extracted text found.'}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Recruitment Status Decision & Internal Notes */}
        <div className="space-y-6">
          {/* Status Progression Action Card */}
          <Card className="p-6 space-y-4 bg-white">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Recruitment Decision
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Progress the candidate through your recruitment pipeline.
            </p>

            <div className="space-y-2 pt-2">
              {[
                { key: 'pending', label: 'Pending', desc: 'Awaiting initial review' },
                { key: 'reviewing', label: 'Under Review', desc: 'Actively screening candidate' },
                { key: 'shortlisted', label: 'Shortlist Candidate', desc: 'Candidate passed screening' },
                { key: 'hired', label: 'Mark as Hired', desc: 'Candidate offered role' },
                { key: 'rejected', label: 'Reject Application', desc: 'Not a fit for this role' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleUpdateStatusAndNotes(item.key as ApplicationStatus)}
                  disabled={isUpdating}
                  className={`w-full p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    status === item.key
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs'
                      : 'border-zinc-200 hover:border-zinc-400 bg-white text-zinc-800'
                  }`}
                >
                  <div className="text-xs font-bold">{item.label}</div>
                  <div
                    className={`text-[11px] mt-0.5 ${
                      status === item.key ? 'text-zinc-300' : 'text-zinc-400'
                    }`}
                  >
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>

            {saveSuccess && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Decision updated successfully!</span>
              </div>
            )}
          </Card>

          {/* Internal Private Recruiter Notes */}
          <Card className="p-6 space-y-3 bg-white">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Internal Recruiter Notes
            </h3>
            <p className="text-[11px] text-zinc-400">
              Private to your company recruitment team. Never visible to the applicant.
            </p>

            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add private evaluation notes, interview feedback, or salary remarks..."
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
            />

            <Button
              size="sm"
              variant="secondary"
              className="w-full justify-center"
              onClick={() => handleUpdateStatusAndNotes()}
              isLoading={isUpdating}
            >
              <Save className="w-3.5 h-3.5" /> Save Internal Notes
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
