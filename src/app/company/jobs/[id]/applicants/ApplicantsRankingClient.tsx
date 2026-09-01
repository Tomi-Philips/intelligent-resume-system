'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Job, JobApplication } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ScorePill } from '@/components/ui/ScorePill';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Users,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Trophy,
  Medal,
  Award,
  Calendar,
  Check,
  TrendingUp,
} from 'lucide-react';

interface ApplicantsRankingClientProps {
  job: Job;
  applications: JobApplication[];
}

export function ApplicantsRankingClient({
  job,
  applications,
}: ApplicantsRankingClientProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredSkillAppId, setHoveredSkillAppId] = useState<string | null>(null);

  // Sort candidates by AI match score (highest score first)
  const sortedApplications = [...applications].sort((a, b) => {
    const scoreA = a.ai_analysis?.match_score || 0;
    const scoreB = b.ai_analysis?.match_score || 0;
    return scoreB - scoreA;
  });

  const filteredApplications = sortedApplications.filter((app) => {
    const matchesStatus =
      selectedStatus === 'all' || app.status === selectedStatus;
    const candidateName = app.job_seeker?.full_name?.toLowerCase() || '';
    const matchesQuery =
      searchQuery === '' || candidateName.includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  // Top 3 Podium vs Remaining #4+ Candidates
  const podiumCandidates = filteredApplications.slice(0, 3);
  const tableCandidates = filteredApplications.slice(3);

  const statusCounts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    reviewing: applications.filter((a) => a.status === 'reviewing').length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
    hired: applications.filter((a) => a.status === 'hired').length,
  };

  const podiumConfig = [
    {
      rank: 1,
      medalEmoji: '🥇',
      label: 'Rank #1 · Top AI Match',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
      cardClass:
        'border-amber-300/90 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/20 shadow-md ring-2 ring-amber-400/20 hover:shadow-lg',
      scoreSize: 'lg' as const,
      highlightBadge: 'Top Contender',
    },
    {
      rank: 2,
      medalEmoji: '🥈',
      label: 'Rank #2 · Strong Fit',
      badgeClass: 'bg-slate-100 text-slate-800 border-slate-300 font-semibold',
      cardClass:
        'border-slate-300/80 bg-gradient-to-b from-slate-50/40 via-white to-slate-50/10 shadow-sm hover:shadow-md',
      scoreSize: 'md' as const,
      highlightBadge: 'Strong Match',
    },
    {
      rank: 3,
      medalEmoji: '🥉',
      label: 'Rank #3 · Solid Fit',
      badgeClass: 'bg-orange-100 text-orange-900 border-orange-300 font-semibold',
      cardClass:
        'border-orange-200/80 bg-gradient-to-b from-orange-50/30 via-white to-orange-50/10 shadow-sm hover:shadow-md',
      scoreSize: 'md' as const,
      highlightBadge: 'High Potential',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Navigation */}
      <Link
        href="/company/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to vacancies
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              Candidate Rankings: {job.title}
            </h1>
            <Badge variant="neutral" size="sm">
              {job.employment_type}
            </Badge>
          </div>
          <p className="text-xs text-zinc-500">
            {applications.length} total applicant{applications.length === 1 ? '' : 's'} ranked using multi-tiered AI evaluation, skill coverage, and semantic matching.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/jobs/${job.id}`} target="_blank">
            <Button variant="secondary" size="sm">
              <Eye className="w-3.5 h-3.5" /> View Public Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* Score Distribution & Overview KPI Card */}
      {applications.length > 0 && (
        <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  AI Match Score Distribution
                </h2>
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Automated qualification spread across {applications.length} evaluated applicant{applications.length === 1 ? '' : 's'}.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-zinc-400">Average Match: </span>
                <span className="font-bold text-zinc-900 font-mono">
                  {Math.round(
                    applications.reduce((acc, a) => acc + (a.ai_analysis?.match_score || 0), 0) /
                      (applications.length || 1)
                  )}%
                </span>
              </div>
              <div className="h-3 w-px bg-zinc-200" />
              <div>
                <span className="text-zinc-400">Top Candidate: </span>
                <span className="font-bold text-emerald-600 font-mono">
                  {Math.max(0, ...applications.map((a) => a.ai_analysis?.match_score || 0))}%
                </span>
              </div>
            </div>
          </div>

          {/* Tier Distribution Progress Bar */}
          <div className="space-y-2">
            <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden flex gap-0.5">
              <div
                style={{
                  width: `${(applications.filter((a) => (a.ai_analysis?.match_score || 0) >= 80).length / (applications.length || 1)) * 100}%`,
                }}
                className="bg-emerald-500 transition-all duration-500 rounded-l-full"
                title="Strong Match (80-100%)"
              />
              <div
                style={{
                  width: `${(applications.filter((a) => (a.ai_analysis?.match_score || 0) >= 60 && (a.ai_analysis?.match_score || 0) < 80).length / (applications.length || 1)) * 100}%`,
                }}
                className="bg-blue-500 transition-all duration-500"
                title="Good Match (60-79%)"
              />
              <div
                style={{
                  width: `${(applications.filter((a) => (a.ai_analysis?.match_score || 0) >= 40 && (a.ai_analysis?.match_score || 0) < 60).length / (applications.length || 1)) * 100}%`,
                }}
                className="bg-amber-400 transition-all duration-500"
                title="Moderate Match (40-59%)"
              />
              <div
                style={{
                  width: `${(applications.filter((a) => (a.ai_analysis?.match_score || 0) < 40).length / (applications.length || 1)) * 100}%`,
                }}
                className="bg-rose-400 transition-all duration-500 rounded-r-full"
                title="Low Match (<40%)"
              />
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-zinc-600 font-medium">Strong (80-100%):</span>
                <span className="font-mono text-zinc-900 font-semibold">
                  {applications.filter((a) => (a.ai_analysis?.match_score || 0) >= 80).length}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-zinc-600 font-medium">Good (60-79%):</span>
                <span className="font-mono text-zinc-900 font-semibold">
                  {applications.filter((a) => (a.ai_analysis?.match_score || 0) >= 60 && (a.ai_analysis?.match_score || 0) < 80).length}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-zinc-600 font-medium">Moderate (40-59%):</span>
                <span className="font-mono text-zinc-900 font-semibold">
                  {applications.filter((a) => (a.ai_analysis?.match_score || 0) >= 40 && (a.ai_analysis?.match_score || 0) < 60).length}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="text-zinc-600 font-medium">Low (&lt;40%):</span>
                <span className="font-mono text-zinc-900 font-semibold">
                  {applications.filter((a) => (a.ai_analysis?.match_score || 0) < 40).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-100 rounded-lg text-xs font-semibold">
          {[
            { id: 'all', label: 'All Candidates', count: statusCounts.all },
            { id: 'pending', label: 'Pending', count: statusCounts.pending },
            { id: 'reviewing', label: 'Under Review', count: statusCounts.reviewing },
            { id: 'shortlisted', label: 'Shortlisted', count: statusCounts.shortlisted },
            { id: 'hired', label: 'Hired', count: statusCounts.hired },
            { id: 'rejected', label: 'Rejected', count: statusCounts.rejected },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedStatus === tab.id
                  ? 'bg-white text-zinc-900 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search candidate name */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
          />
        </div>
      </div>

      {filteredApplications.length > 0 ? (
        <div className="space-y-10">
          {/* ============================================================ */}
          {/* 1. TOP 3 PODIUM LEADERBOARD CARDS                            */}
          {/* ============================================================ */}
          {podiumCandidates.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                    Top AI Matches (Leaderboard Podium)
                  </h2>
                </div>
                <span className="text-xs text-zinc-400">
                  Showing top {podiumCandidates.length} evaluated candidate{podiumCandidates.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {podiumCandidates.map((app, index) => {
                  const cfg = podiumConfig[index] || podiumConfig[2];
                  const score = app.ai_analysis?.match_score || 0;
                  const statusVariant =
                    app.status === 'shortlisted' || app.status === 'hired'
                      ? 'success'
                      : app.status === 'rejected'
                      ? 'danger'
                      : app.status === 'reviewing'
                      ? 'accent'
                      : 'warning';

                  const foundSkills = app.ai_analysis?.found_skills || [];
                  const missingSkills = app.ai_analysis?.missing_skills || [];

                  return (
                    <div
                      key={app.id}
                      className={`relative flex flex-col justify-between p-5 rounded-xl border transition-all duration-200 ${cfg.cardClass}`}
                    >
                      {/* Top Header with Rank Pill & Status */}
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${cfg.badgeClass}`}
                          >
                            <span>{cfg.medalEmoji}</span>
                            <span>{cfg.label}</span>
                          </span>

                          <Badge variant={statusVariant} size="sm">
                            {app.status.toUpperCase()}
                          </Badge>
                        </div>

                        {/* Candidate Name & Applied Date */}
                        <div>
                          <h3 className="text-base font-bold text-zinc-900 truncate">
                            {app.job_seeker?.full_name || 'Candidate'}
                          </h3>
                          <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-zinc-400" />
                            Applied {new Date(app.submitted_at).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Match Score Display */}
                        <div className="p-3 bg-white/80 rounded-lg border border-zinc-200/70 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                              AI Alignment
                            </span>
                            <span className="text-xs font-semibold text-zinc-700">
                              {score >= 80 ? 'Strong Match' : score >= 60 ? 'Good Fit' : 'Moderate Fit'}
                            </span>
                          </div>
                          {app.ai_analysis ? (
                            <ScorePill score={score} size={cfg.scoreSize} />
                          ) : (
                            <span className="text-xs text-zinc-400 italic">Processing...</span>
                          )}
                        </div>

                        {/* Matching Skills Chips */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Matching Skills ({foundSkills.length})
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {foundSkills.length > 0 ? (
                              foundSkills.slice(0, 3).map((skill, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-medium"
                                >
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-zinc-400 text-[10px] italic">None detected</span>
                            )}
                            {foundSkills.length > 3 && (
                              <span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[10px] font-medium">
                                +{foundSkills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Skills to Grow */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-amber-800 flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-amber-600" />
                              Skills to Grow ({missingSkills.length})
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {missingSkills.length > 0 ? (
                              missingSkills.slice(0, 2).map((skill, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-medium"
                                >
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-zinc-400 text-[10px] italic">No major gaps detected</span>
                            )}
                            {missingSkills.length > 2 && (
                              <span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[10px] font-medium">
                                +{missingSkills.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Summary snippet */}
                        {app.ai_analysis?.summary && (
                          <div className="text-[11px] text-zinc-600 bg-white/60 p-2.5 rounded-md border border-zinc-100 line-clamp-2 leading-relaxed">
                            {app.ai_analysis.summary}
                          </div>
                        )}
                      </div>

                      {/* Review Action */}
                      <div className="pt-4 mt-4 border-t border-zinc-200/50">
                        <Link href={`/company/applications/${app.id}`} className="block">
                          <Button variant={index === 0 ? 'primary' : 'secondary'} size="sm" className="w-full justify-center">
                            Review Applicant <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 2. ALL REMAINING APPLICANTS TABLE (#4+)                      */}
          {/* ============================================================ */}
          {tableCandidates.length > 0 ? (
            <div className="space-y-4 pt-4 border-t border-zinc-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-zinc-600" />
                  <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                    Additional Candidates (Ranks #4+)
                  </h2>
                </div>
                <span className="text-xs text-zinc-400">
                  {tableCandidates.length} candidate{tableCandidates.length === 1 ? '' : 's'} in table view
                </span>
              </div>

              <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4 w-12 text-center">Rank</th>
                        <th className="py-3.5 px-4">Candidate</th>
                        <th className="py-3.5 px-4">AI Match Score</th>
                        <th className="py-3.5 px-4">Matching Skills</th>
                        <th className="py-3.5 px-4">Skills to Grow</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {tableCandidates.map((app, index) => {
                        const score = app.ai_analysis?.match_score || 0;
                        const rank = index + 4; // since table starts at rank 4
                        const statusVariant =
                          app.status === 'shortlisted' || app.status === 'hired'
                            ? 'success'
                            : app.status === 'rejected'
                            ? 'danger'
                            : app.status === 'reviewing'
                            ? 'accent'
                            : 'warning';

                        const foundSkills = app.ai_analysis?.found_skills || [];
                        const missingSkills = app.ai_analysis?.missing_skills || [];

                        return (
                          <tr
                            key={app.id}
                            className="hover:bg-zinc-50/70 transition-colors group"
                          >
                            {/* Rank Column */}
                            <td className="py-4 px-4 text-center font-mono font-bold text-zinc-400">
                              #{rank}
                            </td>

                            {/* Candidate Column */}
                            <td className="py-4 px-4">
                              <div className="font-bold text-zinc-900">
                                {app.job_seeker?.full_name || 'Candidate'}
                              </div>
                              <div className="text-[11px] text-zinc-400">
                                Applied {new Date(app.submitted_at).toLocaleDateString()}
                              </div>
                            </td>

                            {/* AI Match Score Column */}
                            <td className="py-4 px-4">
                              {app.ai_analysis ? (
                                <ScorePill score={score} size="sm" />
                              ) : (
                                <span className="text-zinc-400 italic">Processing...</span>
                              )}
                            </td>

                            {/* Matching Skills */}
                            <td className="py-4 px-4 max-w-xs">
                              <div className="flex flex-wrap gap-1">
                                {foundSkills.length > 0 ? (
                                  foundSkills.slice(0, 3).map((skill, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-medium"
                                    >
                                      {skill}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-zinc-400 text-[11px]">None detected</span>
                                )}
                                {foundSkills.length > 3 && (
                                  <span className="text-[10px] text-zinc-400 self-center">
                                    +{foundSkills.length - 3}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Missing Skills */}
                            <td className="py-4 px-4 max-w-xs">
                              <div className="flex flex-wrap gap-1">
                                {missingSkills.length > 0 ? (
                                  missingSkills.slice(0, 2).map((skill, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-medium"
                                    >
                                      {skill}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-zinc-400 text-[10px]">None</span>
                                )}
                                {missingSkills.length > 2 && (
                                  <span className="text-[10px] text-zinc-400 self-center">
                                    +{missingSkills.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Status Column */}
                            <td className="py-4 px-4">
                              <Badge variant={statusVariant} size="sm">
                                {app.status.toUpperCase()}
                              </Badge>
                            </td>

                            {/* Action Column */}
                            <td className="py-4 px-4 text-right">
                              <Link href={`/company/applications/${app.id}`}>
                                <Button variant="secondary" size="sm">
                                  Review <ArrowRight className="w-3 h-3" />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No candidates found in this view"
          description={
            applications.length === 0
              ? 'No candidate has applied to this vacancy yet.'
              : 'Try clearing search terms or selecting a different status filter.'
          }
        />
      )}
    </div>
  );
}

