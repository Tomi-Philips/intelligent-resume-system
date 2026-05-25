'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BrainCircuit, Mail, Lock, AlertCircle, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check if we are using placeholder keys
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      // Simulate login for the prototype
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      return;
    }

    // Real Supabase Auth
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.refresh();
      router.push(new URLSearchParams(window.location.search).get('redirectTo') || '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-[#090A0F] dark:via-[#0F1117] dark:to-[#0A0C10]">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px] dark:bg-blue-600/20 animate-pulse-slow" />
        <div className="absolute bottom-0 -right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-[120px] dark:bg-purple-600/20 animate-pulse-slow-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5kb2QiPjxwYXRoIGQ9Ik0zMCAzMG0tMjkgMGEyOSAyOSAwIDEgMCA1OCAwQTI5IDI5IDAgMSAwIDMwIDMweiIgc3Ryb2tlPSIjMjIyIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] bg-repeat opacity-[0.02] dark:opacity-[0.03]" />
      </div>

      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
      >
        <div className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:border-slate-300 dark:group-hover:border-white/20 transition-all">
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
        </div>
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BrainCircuit className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-left">
              <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-white/70 bg-clip-text text-transparent block">
                HireFlow
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Recruitment Intelligence</span>
            </div>
          </Link>
        </div>

        <Card className="w-full border-0 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          {/* Decorative Top Bar */}
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          <CardHeader className="text-center pb-4 pt-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/20 mx-auto mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Welcome Back</span>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
              Sign In
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 mt-2">
              Access your recruiter dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-8 px-8">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 flex items-start gap-2 text-sm dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 animate-shake">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-white dark:bg-black/30 border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  <Link href="#" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                 <div className="relative group">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                   <Input
                     type={showPassword ? 'text' : 'password'}
                     placeholder={showPassword ? 'Password' : '••••••••'}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="pl-10 pr-10 h-12 bg-white dark:bg-black/30 border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                     required
                   />
                   <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors hover:text-slate-500 dark:hover:text-slate-400"
                     aria-label={showPassword ? 'Hide password' : 'Show password'}
                   >
                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                   </button>
                 </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-70"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white/80 dark:bg-[#111318]/80 text-slate-500 dark:text-slate-400">Or continue with</span>
              </div>
            </div>



            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <Link href="/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1">
                  Request access
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Mode Warning */}
        {process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-medium">Demo Mode:</span>
              <span>Click Sign In to continue to dashboard</span>
            </div>
          </div>
        )}

        {/* Trust Badge */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
            <span>🔒 Secure Login</span>
            <span>⚡ 2FA Available</span>
            <span>🛡️ GDPR Compliant</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(20px, 20px) scale(1.1); opacity: 0.5; }
        }
        @keyframes pulse-slow-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(-20px, -20px) scale(1.1); opacity: 0.5; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 12s ease-in-out infinite;
        }
        .animate-pulse-slow-delayed {
          animation: pulse-slow-delayed 14s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}