'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BrainCircuit, Mail, Lock, User, AlertCircle, ArrowRight, Sparkles, CheckCircle, Shield, Briefcase, TrendingUp, Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: 'recruiter' // Default role for new signups
          }
        }
      });

      if (error) throw error;
      
      setSuccess(true);
      // Optional: Auto redirect after 3 seconds
      setTimeout(() => router.push('/dashboard'), 3000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-[#090A0F] dark:via-[#0F1117] dark:to-[#0A0C10]">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-[120px] dark:bg-indigo-600/20 animate-pulse-slow" />
        <div className="absolute bottom-0 -left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px] dark:bg-blue-600/20 animate-pulse-slow-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-500/5 to-indigo-500/5 blur-3xl" />
        
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
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Start Free Trial</span>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 mt-2">
              Join thousands of recruiters hiring smarter
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-8 px-8">
            {success ? (
              <div className="text-center space-y-4 py-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Check your email!</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  We sent a confirmation link to <strong className="text-blue-600 dark:text-blue-400">{email}</strong>. 
                  Please click the link to activate your account and start hiring.
                </p>
                <div className="pt-4 space-y-3">
                  <Button onClick={() => router.push('/login')} className="w-full h-11 bg-gradient-to-r from-slate-800 to-slate-900 text-white dark:from-white dark:to-slate-100 dark:text-slate-900 rounded-xl font-semibold hover:shadow-lg transition-all">
                    Go to Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <button 
                    onClick={() => setSuccess(false)} 
                    className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                  >
                    ← Back to signup
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 flex items-start gap-2 text-sm dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 animate-shake">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input 
                      type="text" 
                      placeholder="Jane Doe" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-12 bg-white dark:bg-black/30 border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      required
                    />
                  </div>
                </div>

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
                   <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                   <div className="relative group">
                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                     <Input 
                       type={showPassword ? 'text' : 'password'} 
                       placeholder={showPassword ? 'Create a strong password' : '••••••••'} 
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       className="pl-10 pr-10 h-12 bg-white dark:bg-black/30 border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                       required
                       minLength={6}
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
                   
                   {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map((index) => (
                          <div 
                            key={index}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              index < passwordStrength 
                                ? strengthColors[passwordStrength - 1] 
                                : 'bg-slate-200 dark:bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Password strength: <span className={`font-medium ${
                          passwordStrength === 1 ? 'text-red-500' :
                          passwordStrength === 2 ? 'text-orange-500' :
                          passwordStrength === 3 ? 'text-yellow-600' :
                          passwordStrength === 4 ? 'text-green-500' : ''
                        }`}>
                          {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                        </span>
                      </p>
                      <ul className="text-xs text-slate-400 space-y-0.5 mt-1">
                        {password.length < 8 && <li className="text-red-500">• At least 8 characters</li>}
                        {!password.match(/[A-Z]/) && <li className="text-red-500">• At least one uppercase letter</li>}
                        {!password.match(/[0-9]/) && <li className="text-red-500">• At least one number</li>}
                      </ul>
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-70 mt-6" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>

                {/* Terms Agreement */}
                <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
                  By signing up, you agree to our{' '}
                  <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>
                </p>
              </form>
            )}

            {!success && (
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1">
                    Sign in instead
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feature Highlights */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-500/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Secure</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 dark:bg-indigo-500/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-indigo-500" />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Free Trial</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-purple-500/10 dark:bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Scale Fast</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(-20px, 20px) scale(1.1); opacity: 0.5; }
        }
        @keyframes pulse-slow-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(20px, -20px) scale(1.1); opacity: 0.5; }
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