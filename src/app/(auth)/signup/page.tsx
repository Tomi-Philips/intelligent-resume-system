'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { UserRole } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';
import { AlertCircle, CheckCircle2, User, Building2 } from 'lucide-react';
import { PasswordInput } from '@/components/ui/PasswordInput';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [selectedRole, setSelectedRole] = useState<UserRole>('job_seeker');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: selectedRole,
            full_name: fullName || (selectedRole === 'company' ? companyName : email.split('@')[0]),
            company_name: selectedRole === 'company' ? companyName : undefined,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: data.user.email || email,
          role: selectedRole,
          full_name: fullName || (selectedRole === 'company' ? companyName : email.split('@')[0]),
        });

        if (selectedRole === 'company' && companyName) {
          await supabase.from('companies').upsert({
            user_id: data.user.id,
            name: companyName,
            email: email,
          }, { onConflict: 'user_id' });
        }

        if (data.session) {
          if (selectedRole === 'company') {
            router.push('/company/profile');
          } else {
            router.push('/profile');
          }
          router.refresh();
        } else {
          setSuccessMsg('Account created successfully! Please check your email to verify your address, then sign in.');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 bg-white shadow-xs border-zinc-200">
      <div className="text-center mb-6">
        <Logo size="lg" className="justify-center mb-4" />
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          Create your account
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Select your account type to get started
        </p>
      </div>

      {/* Role Toggle */}
      <div className="grid grid-cols-2 p-1 bg-zinc-100 rounded-lg mb-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setSelectedRole('job_seeker')}
          className={`py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            selectedRole === 'job_seeker'
              ? 'bg-white text-zinc-900 shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Job Seeker</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedRole('company')}
          className={`py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            selectedRole === 'company'
              ? 'bg-white text-zinc-900 shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Company</span>
        </button>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {selectedRole === 'job_seeker' ? (
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Morgan"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Nexus Software Solutions"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder={selectedRole === 'company' ? 'recruiting@company.com' : 'you@example.com'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
          />
        </div>

        <PasswordInput
          label="Password"
          required
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" isLoading={isLoading} className="w-full mt-2">
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-zinc-500">
        Already have an account?{' '}
        <Link href="/login" className="text-zinc-900 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
