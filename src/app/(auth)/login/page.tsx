'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { isJobSeekerProfileComplete, isCompanyProfileComplete } from '@/lib/profile-completeness';
import { Profile, Company } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';
import { AlertCircle } from 'lucide-react';
import { PasswordInput } from '@/components/ui/PasswordInput';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (data?.user) {
        let destination = redirectUrl;

        if (!destination) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const role = profile?.role || data.user.user_metadata?.role;

          if (role === 'admin') {
            destination = '/admin/dashboard';
          } else if (role === 'company') {
            const { data: company } = await supabase
              .from('companies')
              .select('*')
              .eq('user_id', data.user.id)
              .maybeSingle();

            if (!isCompanyProfileComplete(company as Company | null)) {
              destination = '/company/profile';
            } else {
              destination = '/company/dashboard';
            }
          } else {
            // Job Seeker
            if (!isJobSeekerProfileComplete(profile as Profile | null)) {
              destination = '/profile';
            } else {
              destination = '/dashboard';
            }
          }
        }

        window.location.href = destination || '/dashboard';
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMsg(msg);
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8 bg-white shadow-xs border-zinc-200">
      <div className="text-center mb-6">
        <Logo size="lg" className="justify-center mb-4" />
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          Sign in to your account
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Access your recruitment or candidate dashboard
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-zinc-700">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full mt-2">
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-zinc-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-zinc-900 font-semibold hover:underline">
          Create an account
        </Link>
      </p>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-xs text-zinc-400 text-center">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
