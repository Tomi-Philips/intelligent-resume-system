'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { jobService } from '../../services/job.service';
import { 
  Briefcase, 
  TrendingUp, 
  FileText, 
  Hash, 
  X, 
  Plus, 
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

export function JobForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    experience_level: '',
    skillsInput: '',
  });

  // Track touched fields for validation
  const [touched, setTouched] = useState({
    title: false,
    description: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const skills = formData.skillsInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      await jobService.createJob({
        title: formData.title,
        description: formData.description,
        experience_level: formData.experience_level,
        required_skills: skills,
      });

      setSuccess(true);
      // Short delay to show success message then redirect
      setTimeout(() => {
        router.push('/jobs');
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create job');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extract skills as array for display
  const skillsArray = formData.skillsInput
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skillsArray.filter(s => s !== skillToRemove).join(', ');
    setFormData(prev => ({ ...prev, skillsInput: newSkills }));
  };

  // Validation
  const isTitleValid = formData.title.length >= 3;
  const isDescriptionValid = formData.description.length >= 20;
  const isFormValid = isTitleValid && isDescriptionValid;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 animate-slide-down">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Job Created Successfully!</p>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Redirecting to jobs page...</p>
          </div>
          <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/20 animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">Error</p>
            <p className="text-xs text-rose-600/70 dark:text-rose-400/70">{error}</p>
          </div>
        </div>
      )}

      {/* AI Tip Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border border-blue-500/20">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">AI-Powered Matching</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            The more detailed your job description and skills, the more accurate the candidate matching will be.
          </p>
        </div>
      </div>

      {/* Job Title */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-500" />
          Job Title
          <span className="text-rose-500">*</span>
        </label>
        <Input
          id="title"
          name="title"
          placeholder="e.g., Senior Frontend Engineer"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className={`h-12 bg-white dark:bg-black/30 border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all ${
            touched.title && !isTitleValid && formData.title ? 'border-rose-500 focus:border-rose-500' : ''
          }`}
        />
        {touched.title && formData.title && !isTitleValid && (
          <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Job title must be at least 3 characters
          </p>
        )}
        <p className="text-xs text-slate-400 mt-1">
          Use a clear, specific title for better candidate matching
        </p>
      </div>

      {/* Experience Level */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          Experience Level
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Entry Level', 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Manager', 'Director', 'Executive'].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, experience_level: level }))}
              className={`px-3 py-2 text-sm rounded-xl transition-all duration-200 ${
                formData.experience_level === level
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <Input
          id="experience_level"
          name="experience_level"
          placeholder="Or type custom level..."
          value={formData.experience_level}
          onChange={handleChange}
          className="h-10 bg-white dark:bg-black/30 border-slate-200 dark:border-white/10 rounded-xl mt-2"
        />
      </div>

      {/* Job Description */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-500" />
          Job Description
          <span className="text-rose-500">*</span>
        </label>
        <Textarea
          id="description"
          name="description"
          placeholder="Detailed description of the role, responsibilities, and what you're looking for..."
          className={`min-h-[180px] bg-white dark:bg-black/30 border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all resize-none ${
            touched.description && !isDescriptionValid && formData.description ? 'border-rose-500 focus:border-rose-500' : ''
          }`}
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {touched.description && formData.description && !isDescriptionValid && (
          <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Description must be at least 20 characters
          </p>
        )}
        <div className="flex justify-between items-center">
          <p className="text-xs text-slate-400">
            Include key responsibilities, qualifications, and benefits
          </p>
          <p className="text-xs text-slate-400">
            {formData.description.length} characters
          </p>
        </div>
      </div>

      {/* Required Skills */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Hash className="w-4 h-4 text-amber-500" />
          Required Skills
        </label>
        
        {/* Skills Input */}
        <Input
          id="skillsInput"
          name="skillsInput"
          placeholder="React, TypeScript, Node.js, Python, AWS..."
          value={formData.skillsInput}
          onChange={handleChange}
          className="h-12 bg-white dark:bg-black/30 border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/20"
        />
        
        {/* Skills Tags */}
        {skillsArray.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {skillsArray.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 group"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:bg-blue-500/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        
        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
          <Zap className="w-3 h-3" />
          Separate skills with commas. These will be used for AI matching.
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="px-6 h-11 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          isLoading={isSubmitting}
          disabled={!isFormValid}
          className="px-8 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 animate-spin" />
              Creating Job...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Job
            </span>
          )}
        </Button>
      </div>

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </form>
  );
}