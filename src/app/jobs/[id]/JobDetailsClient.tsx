'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Job, Profile } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ApplyModal } from '@/components/jobs/ApplyModal';
import {
  MapPin,
  Clock,
  Building2,
  Calendar,
  DollarSign,
  GraduationCap,
  ArrowLeft,
  CheckCircle2,
  Globe,
  Share2,
} from 'lucide-react';

interface JobDetailsClientProps {
  job: Job;
  isLoggedIn: boolean;
  currentUserProfile: Profile | null;
  hasApplied: boolean;
}

export function JobDetailsClient({
  job,
  isLoggedIn,
  currentUserProfile,
  hasApplied,
}: JobDetailsClientProps) {
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Button */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to open vacancies
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Job Details Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-zinc-200 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                  {job.title}
                </h1>
                <p className="text-xs text-zinc-600 flex items-center gap-1.5">
                  {job.company?.logo_url ? (
                    <span className="relative w-5 h-5 rounded-md overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0 flex items-center justify-center">
                      <Image
                        src={job.company.logo_url}
                        alt={`${job.company.name} logo`}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </span>
                  ) : (
                    <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                  {job.company?.name || 'Company'}
                  {job.company?.location && (
                    <>
                      <span className="text-zinc-300">·</span>
                      <span>{job.company.location}</span>
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="neutral">{job.employment_type}</Badge>
                {job.status === 'published' && (
                  <Badge variant="success">Active</Badge>
                )}
              </div>
            </div>

            {/* Quick Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-100 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>{job.experience_years_required}+ yrs experience</span>
              </div>
              {job.salary_range && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span>{job.salary_range}</span>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-zinc-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              Role Description
            </h2>
            <div className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {/* Required Skills */}
          {job.required_skills && job.required_skills.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-zinc-200 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                Required Technical Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.required_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-zinc-100 border border-zinc-200/80 rounded-md text-xs font-medium text-zinc-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Preferred Skills */}
          {job.preferred_skills && job.preferred_skills.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-zinc-200 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                Preferred Qualifications & Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.preferred_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-md text-xs font-medium text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Apply & Company Card */}
        <div className="space-y-6">
          {/* Action Box */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-zinc-900">Interested in this role?</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Upload your CV to have your experience screened and ranked against this vacancy.
            </p>

            {hasApplied ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You have submitted an application for this position.</span>
              </div>
            ) : currentUserProfile?.role === 'company' ? (
              <div className="p-3 bg-zinc-100 rounded-lg text-xs text-zinc-600">
                You are currently signed in with a Company account. Job application is reserved for Job Seekers.
              </div>
            ) : (
              <Button
                className="w-full justify-center shadow-xs"
                size="lg"
                onClick={() => setIsApplyOpen(true)}
              >
                Apply Now
              </Button>
            )}

            {job.deadline && (
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 pt-2 border-t border-zinc-100">
                <Calendar className="w-3.5 h-3.5" />
                <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
              </div>
            )}
          </Card>

          {/* Company Profile Card */}
          <Card className="p-6 space-y-3">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              About the Company
            </h3>
            <div className="flex items-center gap-3">
              {job.company?.logo_url ? (
                <span className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0 flex items-center justify-center">
                  <Image
                    src={job.company.logo_url}
                    alt={`${job.company.name} logo`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </span>
              ) : (
                <span className="w-12 h-12 rounded-lg bg-zinc-100 border border-zinc-200 shrink-0 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-zinc-300" />
                </span>
              )}
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-zinc-900">
                  {job.company?.name || 'Company'}
                </p>
                {job.company?.industry && (
                  <Badge variant="neutral" size="sm">
                    {job.company.industry}
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              {job.company?.description && (
                <p className="text-xs text-zinc-500 line-clamp-4 leading-relaxed pt-1">
                  {job.company.description}
                </p>
              )}
            </div>

            {job.company?.website && (
              <a
                href={job.company.website.startsWith('http') ? job.company.website : `https://${job.company.website}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline pt-2"
              >
                <Globe className="w-3.5 h-3.5" /> Visit Company Website
              </a>
            )}
          </Card>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        jobId={job.id}
        jobTitle={job.title}
        companyName={job.company?.name || 'Company'}
        isLoggedIn={isLoggedIn}
        userRole={currentUserProfile?.role}
      />
    </div>
  );
}
