'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, AlertCircle, Plus, X } from 'lucide-react';

export default function CreateJobPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [location, setLocation] = useState('Remote');
  const [experienceYears, setExperienceYears] = useState('2');
  const [salaryRange, setSalaryRange] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [description, setDescription] = useState('');

  // Skills lists
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [newRequiredSkill, setNewRequiredSkill] = useState('');

  const [preferredSkills, setPreferredSkills] = useState<string[]>([]);
  const [newPreferredSkill, setNewPreferredSkill] = useState('');

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

    if (requiredSkills.length === 0) {
      setErrorMsg('Please add at least one required technical skill for AI screening.');
      setIsSaving(false);
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch company
      const { data: company, error: compError } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (compError || !company) {
        setErrorMsg('Please complete your company profile before posting a job.');
        setIsSaving(false);
        return;
      }

      const { data: newJob, error: jobError } = await supabase
        .from('jobs')
        .insert({
          company_id: company.id,
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
        })
        .select()
        .single();

      if (jobError || !newJob) {
        setErrorMsg(jobError?.message || 'Failed to create job vacancy.');
      } else {
        router.push('/company/jobs');
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/company/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to vacancies
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Post a New Job Vacancy
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Specify role expectations and skills. The AI engine will evaluate candidate resumes against these exact parameters.
        </p>
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
                placeholder="e.g. Senior Frontend Engineer"
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
                placeholder="e.g. Remote, London, Hybrid"
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
                placeholder="e.g. 3"
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Salary Range (Optional)
              </label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="e.g. $80,000 - $110,000"
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Application Deadline (Optional)
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
                Publication Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              >
                <option value="published">Published (Accept Applications)</option>
                <option value="draft">Draft (Private)</option>
              </select>
            </div>
          </div>

          {/* Required Skills input */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Required Technical Skills * (Used for AI match scoring)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newRequiredSkill}
                onChange={(e) => setNewRequiredSkill(e.target.value)}
                onKeyDown={handleAddRequiredSkill}
                placeholder="Type a required skill (e.g. React, Next.js, PostgreSQL) and press Enter"
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
              {requiredSkills.length === 0 && (
                <span className="text-[11px] text-zinc-400">
                  No required skills added yet. Add at least one.
                </span>
              )}
            </div>
          </div>

          {/* Preferred Skills input */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Preferred Skills & Qualifications (Optional)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newPreferredSkill}
                onChange={(e) => setNewPreferredSkill(e.target.value)}
                onKeyDown={handleAddPreferredSkill}
                placeholder="Type a preferred skill (e.g. Docker, AWS, GraphQL) and press Enter"
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
              {preferredSkills.length === 0 && (
                <span className="text-[11px] text-zinc-400">
                  No preferred skills added.
                </span>
              )}
            </div>
          </div>

          {/* Full Job Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Detailed Job Description *
            </label>
            <textarea
              rows={8}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the responsibilities, day-to-day work, qualifications, and benefits for this position..."
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
              Create & Publish Job
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
