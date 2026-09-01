'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, AlertCircle, Plus, X, Trash2 } from 'lucide-react';

export default function EditJobPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [location, setLocation] = useState('Remote');
  const [experienceYears, setExperienceYears] = useState('2');
  const [salaryRange, setSalaryRange] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'closed'>('published');
  const [description, setDescription] = useState('');

  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [newRequiredSkill, setNewRequiredSkill] = useState('');

  const [preferredSkills, setPreferredSkills] = useState<string[]>([]);
  const [newPreferredSkill, setNewPreferredSkill] = useState('');

  useEffect(() => {
    async function loadJob() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        const { data: job, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !job) {
          router.push('/company/jobs');
          return;
        }

        setTitle(job.title || '');
        setEmploymentType(job.employment_type || 'Full-time');
        setLocation(job.location || 'Remote');
        setExperienceYears(String(job.experience_years_required || 0));
        setSalaryRange(job.salary_range || '');
        setDeadline(job.deadline || '');
        setStatus(job.status || 'published');
        setDescription(job.description || '');
        setRequiredSkills(job.required_skills || []);
        setPreferredSkills(job.preferred_skills || []);
      } catch {
        router.push('/company/jobs');
      } finally {
        setIsLoading(false);
      }
    }

    loadJob();
  }, [id, router, supabase]);

  const handleAddRequiredSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = newRequiredSkill.trim();
    if (trimmed && !requiredSkills.includes(trimmed)) {
      setRequiredSkills([...requiredSkills, trimmed]);
      setNewRequiredSkill('');
    }
  };

  const handleAddPreferredSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = newPreferredSkill.trim();
    if (trimmed && !preferredSkills.includes(trimmed)) {
      setPreferredSkills([...preferredSkills, trimmed]);
      setNewPreferredSkill('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          title,
          description,
          employment_type: employmentType,
          location,
          experience_years_required: parseFloat(experienceYears) || 0,
          salary_range: salaryRange || null,
          deadline: deadline || null,
          status,
          required_skills: requiredSkills,
          preferred_skills: preferredSkills,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push('/company/jobs');
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update job.';
      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job vacancy and all associated applications?')) {
      return;
    }
    setIsDeleting(true);
    try {
      await supabase.from('jobs').delete().eq('id', id);
      router.push('/company/jobs');
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete job');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-zinc-500">
        Loading job vacancy details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/company/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to vacancies
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Edit Job Vacancy
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Update job details, criteria, and publication status.
          </p>
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
          isLoading={isDeleting}
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete Vacancy
        </Button>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <Card className="p-6 sm:p-8 bg-white shadow-2xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Employment Type *
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Required Experience (Years) *
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                required
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Salary Range
              </label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Application Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'closed')}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              >
                <option value="published">Published (Active)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="closed">Closed (No new applicants)</option>
              </select>
            </div>
          </div>

          {/* Required skills */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Required Technical Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newRequiredSkill}
                onChange={(e) => setNewRequiredSkill(e.target.value)}
                onKeyDown={handleAddRequiredSkill}
                placeholder="Add required skill..."
                className="flex-1 px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddRequiredSkill}>
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-zinc-50 border border-zinc-200 rounded-md">
              {requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-zinc-300 text-zinc-800 rounded-md text-xs font-medium"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => setRequiredSkills(requiredSkills.filter((s) => s !== skill))}
                    className="text-zinc-400 hover:text-zinc-700 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Preferred skills */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Preferred Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newPreferredSkill}
                onChange={(e) => setNewPreferredSkill(e.target.value)}
                onKeyDown={handleAddPreferredSkill}
                placeholder="Add preferred skill..."
                className="flex-1 px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddPreferredSkill}>
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-zinc-50 border border-zinc-200 rounded-md">
              {preferredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-md text-xs font-medium"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => setPreferredSkills(preferredSkills.filter((s) => s !== skill))}
                    className="text-blue-400 hover:text-blue-700 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Job Description *
            </label>
            <textarea
              rows={8}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400 leading-relaxed font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
            <Link href="/company/jobs">
              <Button type="button" variant="outline" size="sm">
                Cancel
              </Button>
            </Link>
            <Button type="submit" size="sm" isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
