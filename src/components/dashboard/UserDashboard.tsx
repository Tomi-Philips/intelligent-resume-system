'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Briefcase, Send, Clock, User, CheckCircle, AlertCircle, FileText, Sparkles, Phone, Mail, ChevronRight, UploadCloud } from 'lucide-react';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  department: string;
  description: string;
  required_skills: string[];
  experience_level: string;
  status: string;
}

interface Application {
  id: string;
  job_id: string;
  name: string;
  email: string;
  phone: string;
  score: number;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected';
  created_at: string;
  job_title?: string;
  match_breakdown?: {
    found?: string[];
    missing?: string[];
    summary?: string;
  };
}

export function UserDashboard() {
  const { name: authName, email: authEmail } = useAuth();
  const [openJobs, setOpenJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Apply Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Details Modal state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch open jobs
      const { data: jobsData, error: jobsErr } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (jobsErr) throw jobsErr;
      setOpenJobs(jobsData || []);

      // Fetch user applications where candidate email matches auth email
      if (authEmail) {
        const { data: appData, error: appErr } = await supabase
          .from('candidates')
          .select('*, job:jobs(title)')
          .eq('email', authEmail)
          .order('created_at', { ascending: false });

        if (appErr) throw appErr;

        const apps = (appData || []).map((app: any) => ({
          ...app,
          job_title: app.job?.title || 'Unknown Job',
        }));
        setApplications(apps);
      }
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [authEmail]);

  const handleOpenApply = (job: Job) => {
    setSelectedJob(job);
    setApplicantName(authName || '');
    setApplicantEmail(authEmail || '');
    setApplicantPhone('');
    setResumeFile(null);
    setSubmitSuccess(false);
    setSubmitError('');
    setApplyModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !resumeFile) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const formData = new FormData();
      formData.append('file', resumeFile);
      formData.append('jobId', selectedJob.id);
      formData.append('name', applicantName);
      formData.append('email', applicantEmail);
      formData.append('phone', applicantPhone);

      const res = await fetch('/api/resumes/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit application.');
      }

      setSubmitSuccess(true);
      fetchData(); // Reload apps
      setTimeout(() => {
        setApplyModalOpen(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (err: any) {
      setSubmitError(err.message || 'Error uploading resume');
    } finally {
      setSubmitting(false);
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status: Application['status']) => {
    const styles = {
      pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      reviewing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      shortlisted: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  // Score Color Helper
  const renderScore = (score: number) => {
    let color = 'text-rose-500';
    if (score >= 80) color = 'text-emerald-500';
    else if (score >= 50) color = 'text-amber-500';

    return <span className={`font-bold ${color}`}>{score}%</span>;
  };

  // Calc Summary Stats
  const totalApps = applications.length;
  const shortlistedApps = applications.filter((app) => app.status === 'shortlisted').length;
  const avgScore = totalApps > 0 ? Math.round(applications.reduce((acc, app) => acc + app.score, 0) / totalApps) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4 animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Applicant Portal</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
          Welcome back, {authName.split(' ')[0]}!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Browse active job listings and track your applications</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Applications Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">{totalApps}</p>
            <p className="text-xs text-slate-400 mt-1">Across all job departments</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Shortlisted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-emerald-500">{shortlistedApps}</p>
            <p className="text-xs text-slate-400 mt-1">Pending recruiter follow-up</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Average Match Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">{avgScore}%</p>
            <div className="mt-2 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" 
                style={{ width: `${avgScore}%` }} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Section */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">My Applications</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Real-time status of your submissions</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table<Application>
            data={applications}
            keyExtractor={(app) => app.id}
            emptyMessage="You haven't applied to any jobs yet. Browse available jobs below to start your applications."
            columns={[
              {
                key: 'job_title',
                header: 'Job Title',
                render: (app) => <span className="font-semibold text-slate-900 dark:text-white">{app.job_title}</span>,
              },
              {
                key: 'score',
                header: 'AI Fit Score',
                render: (app) => renderScore(app.score),
              },
              {
                key: 'status',
                header: 'Status',
                render: (app) => renderStatusBadge(app.status),
              },
              {
                key: 'created_at',
                header: 'Applied Date',
                render: (app) => <span>{new Date(app.created_at).toLocaleDateString()}</span>,
              },
              {
                key: 'actions',
                header: '',
                className: 'text-right',
                render: (app) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl font-medium gap-1"
                    onClick={() => {
                      setSelectedApp(app);
                      setDetailsModalOpen(true);
                    }}
                  >
                    View Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Available Jobs Listings */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Browse Open Positions</h2>
            <p className="text-xs text-slate-400">Available opportunities with instant AI ranking</p>
          </div>
        </div>

        {openJobs.length === 0 ? (
          <div className="text-center py-12 bg-white/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/60 rounded-2xl">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No open positions available at this moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {openJobs.map((job) => (
              <Card 
                key={job.id} 
                className="group border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#111318]/80 hover:border-blue-500/40 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="p-6 pb-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {job.department || 'General'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {job.experience_level || 'All Experience Levels'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                  {job.required_skills && job.required_skills.length > 0 && (
                    <div className="px-6 pb-4 flex flex-wrap gap-1.5">
                      {job.required_skills.slice(0, 4).map((skill) => (
                        <span key={skill} className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                          {skill}
                        </span>
                      ))}
                      {job.required_skills.length > 4 && (
                        <span className="text-xs text-slate-400 pt-0.5 ml-1">+{job.required_skills.length - 4} more</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-auto flex items-center justify-end">
                  <Button 
                    onClick={() => handleOpenApply(job)}
                    className="h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl border-none shadow-md group-hover:from-blue-700 group-hover:to-indigo-700 transition-all font-semibold"
                  >
                    Apply Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      <Modal
        open={applyModalOpen}
        onClose={() => !submitting && setApplyModalOpen(false)}
        title={selectedJob ? `Apply: ${selectedJob.title}` : 'Submit Application'}
        maxWidth="md"
      >
        {submitSuccess ? (
          <div className="text-center space-y-4 py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
              <CheckCircle className="w-8 h-8 text-white animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Application Submitted!</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
              Your resume was successfully uploaded and evaluated by HireFlow AI. You can track your match score and pipelines status on the homepage.
            </p>
          </div>
        ) : (
          <form onSubmit={handleApplySubmit} className="space-y-6">
            {submitError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2 text-sm dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Jane Doe"
                    className="pl-10 h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    required
                    type="email"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="pl-10 h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="tel"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="pl-10 h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>

            {/* Resume Upload Drag/Drop */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Upload Resume (PDF or DOCX)</label>
              <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center hover:border-blue-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-all cursor-pointer relative group">
                <input
                  required
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      {resumeFile ? resumeFile.name : 'Click to select or drag your CV here'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {resumeFile ? `${(resumeFile.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOCX formats up to 5MB'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl"
                onClick={() => setApplyModalOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={submitting}
                disabled={submitting || !resumeFile}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg border-none"
              >
                {submitting ? 'Analyzing & Submitting…' : 'Submit Application'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Details Modal */}
      <Modal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={selectedApp ? `Application: ${selectedApp.job_title}` : 'Details'}
        maxWidth="lg"
      >
        {selectedApp && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Application Status</p>
                <div className="mt-1 flex items-center gap-2">
                  {renderStatusBadge(selectedApp.status)}
                  <span className="text-xs text-slate-400">Applied on {new Date(selectedApp.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl px-4 py-2 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Evaluation</p>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{renderScore(selectedApp.score)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Match Skills Breakdown */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                  Skills Matching
                </h4>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Matched Skills ({selectedApp.match_breakdown?.found?.length || 0})</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {selectedApp.match_breakdown?.found?.length ? (
                        selectedApp.match_breakdown.found.map((skill) => (
                          <span key={skill} className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">No matching skills identified.</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-rose-500 uppercase tracking-wide">Missing Skills ({selectedApp.match_breakdown?.missing?.length || 0})</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {selectedApp.match_breakdown?.missing?.length ? (
                        selectedApp.match_breakdown.missing.map((skill) => (
                          <span key={skill} className="text-xs px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-600">Perfect skills match! No missing skills.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Evaluation Summary */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-500" />
                  AI Summary
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{selectedApp.match_breakdown?.summary || 'No evaluation summary compiled yet.'}"
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex justify-end">
              <Button
                variant="ghost"
                className="rounded-xl"
                onClick={() => setDetailsModalOpen(false)}
              >
                Close Details
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
