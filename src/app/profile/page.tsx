'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  User,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
} from 'lucide-react';

export default function CandidateProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login?redirect=/profile');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          const p = profile as Profile;
          setFullName(p.full_name || '');
          setPhone(p.phone || '');
          setHeadline(p.headline || '');
          setLocation(p.location || '');
          setBio(p.bio || '');
          setSkills(p.skills || []);
        }
      } catch (err: unknown) {
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [router, supabase]);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone,
          headline,
          location,
          bio,
          skills,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile.';
      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-xs text-zinc-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Candidate Profile
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Keep your skills and personal information up to date for recruiters.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <Card className="p-6 sm:p-8 bg-white shadow-2xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Professional Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Senior Frontend Developer"
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. London, UK (or Remote)"
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Professional Summary / Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief summary of your experience, technical focus, and accomplishments..."
              className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
            />
          </div>

          {/* Key Technical Skills Tag input */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Key Technical Skills
            </label>
            <div className="flex gap-2 mb-2.5">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Add a skill (e.g. React, TypeScript, Python) and press Enter"
                className="flex-1 px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddSkill}
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-zinc-50 border border-zinc-200/80 rounded-md">
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-zinc-200 text-zinc-800 rounded-md text-xs font-medium"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-zinc-400 hover:text-zinc-700 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-zinc-400">
                  No skills added yet. Add relevant competencies above.
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-100">
            <Button type="submit" isLoading={isSaving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
