'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Upload, AlertCircle, CheckCircle2, FileText } from 'lucide-react';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  companyName: string;
  isLoggedIn: boolean;
  userRole?: string | null;
}

export function ApplyModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  companyName,
  isLoggedIn,
  userRole,
}: ApplyModalProps) {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain',
      ];
      if (
        !validTypes.includes(selected.type) &&
        !selected.name.endsWith('.pdf') &&
        !selected.name.endsWith('.docx')
      ) {
        setErrorMsg('Please upload a valid PDF or DOCX file.');
        return;
      }
      if (selected.size > 5 * 1024 * 1024) {
        setErrorMsg('File size must be under 5MB.');
        return;
      }
      setErrorMsg(null);
      setFile(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select a resume file.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('job_id', jobId);
      formData.append('resume', file);

      const res = await fetch('/api/applications/apply', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to submit application.');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        router.push(`/applications/${data.applicationId}`);
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during submission.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Sign In Required">
        <div className="text-center py-4">
          <p className="text-sm text-zinc-600 mb-6">
            You must be logged in with a Job Seeker account to apply for <span className="font-semibold">{jobTitle}</span>.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="secondary"
              onClick={() => {
                onClose();
                router.push(`/login?redirect=/jobs/${jobId}`);
              }}
            >
              Sign In
            </Button>
            <Button
              onClick={() => {
                onClose();
                router.push(`/signup?redirect=/jobs/${jobId}`);
              }}
            >
              Create Account
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  if (userRole === 'company') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Company Account Detected">
        <div className="text-center py-4">
          <p className="text-sm text-zinc-600 mb-6">
            Company accounts cannot apply for vacancies. Please sign in as a Job Seeker to submit an application.
          </p>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply for ${jobTitle}`}
      description={`Submit your resume to ${companyName} for automated screening.`}
    >
      {success ? (
        <div className="text-center py-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-zinc-900">Application Submitted!</h4>
          <p className="text-xs text-zinc-500">
            Your resume has been analyzed. Redirecting to your application assessment...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-2">
              Upload CV / Resume (PDF or DOCX, max 5MB)
            </label>

            <label className="border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-50/50 hover:bg-zinc-50">
              <input
                type="file"
                accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
                disabled={isSubmitting}
              />
              {file ? (
                <div className="flex items-center gap-2 text-zinc-800">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div className="text-left">
                    <p className="text-xs font-semibold">{file.name}</p>
                    <p className="text-[11px] text-zinc-400">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-zinc-700">
                    Click to select resume file
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    PDF, DOCX formats supported
                  </p>
                </div>
              )}
            </label>
          </div>

          <div className="bg-zinc-50 p-3.5 rounded-lg border border-zinc-200 text-[11px] text-zinc-500 leading-relaxed">
            <span className="font-semibold text-zinc-700">AI Screening Note:</span> Your resume text will be processed against the vacancy requirements to generate an objective match assessment for the recruiter.
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting} disabled={!file}>
              Submit Application
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
