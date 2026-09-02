'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { UserRole } from '@/types/database';
import { LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser({ id: user.id, email: user.email || '' });

          const { data: profile } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', user.id)
            .single();

          if (profile) {
            setRole(profile.role as UserRole);

            if (profile.role === 'company') {
              const { data: comp } = await supabase
                .from('companies')
                .select('name')
                .eq('user_id', user.id)
                .single();
              if (comp) setCompanyName(comp.name);
            }
          } else {
            const metaRole = user.user_metadata?.role as UserRole;
            setRole(metaRole || 'job_seeker');
          }
        }
      } catch (err) {
        console.error('Navbar auth error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
      } else {
        setUser(null);
        setRole(null);
        setCompanyName(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-5">
          <Link
            href="/jobs"
            className={`text-sm transition-colors ${
              pathname.startsWith('/jobs') ? 'text-zinc-900 font-medium' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            Browse Job
          </Link>

          {!isLoading && user && (
            <>
              {role === 'job_seeker' && (
                <>
                  <Link
                    href="/dashboard"
                    className={`text-sm transition-colors ${
                      pathname === '/dashboard' ? 'text-zinc-900 font-medium' : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/applications"
                    className={`text-sm transition-colors ${
                      pathname.startsWith('/applications') ? 'text-zinc-900 font-medium' : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    Applications
                  </Link>
                </>
              )}

              {role === 'company' && (
                <>
                  <Link
                    href="/company/dashboard"
                    className={`text-sm transition-colors ${
                      pathname === '/company/dashboard' ? 'text-zinc-900 font-medium' : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/company/jobs"
                    className={`text-sm transition-colors ${
                      pathname.startsWith('/company/jobs') ? 'text-zinc-900 font-medium' : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    My Jobs
                  </Link>
                </>
              )}

              {role === 'admin' && (
                <Link
                  href="/admin/dashboard"
                  className={`text-sm transition-colors ${
                    pathname.startsWith('/admin') ? 'text-zinc-900 font-medium' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {isLoading ? (
            <div className="h-8 w-20 bg-zinc-100 rounded-md animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href={role === 'company' ? '/company/dashboard' : role === 'admin' ? '/admin/dashboard' : '/dashboard'}>
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Button>
              </Link>
              <span className="text-sm text-zinc-600">
                {companyName || user.email.split('@')[0]}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  Get started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden p-1.5 rounded-md text-zinc-600 hover:bg-zinc-100"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-3">
          <Link
            href="/jobs"
            onClick={() => setIsMobileOpen(false)}
            className="block text-sm text-zinc-700 py-1"
          >
            Jobs
          </Link>
          {user && (
            <Link
              href={role === 'company' ? '/company/dashboard' : role === 'admin' ? '/admin/dashboard' : '/dashboard'}
              onClick={() => setIsMobileOpen(false)}
              className="block text-sm text-zinc-700 py-1"
            >
              Dashboard
            </Link>
          )}
          {user && role === 'job_seeker' && (
            <Link href="/applications" onClick={() => setIsMobileOpen(false)} className="block text-sm text-zinc-700 py-1">
              Applications
            </Link>
          )}
          {user && role === 'company' && (
            <Link href="/company/jobs" onClick={() => setIsMobileOpen(false)} className="block text-sm text-zinc-700 py-1">
              My Jobs
            </Link>
          )}

          <div className="pt-3 border-t border-zinc-100">
            {user ? (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-center">
                Sign out
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setIsMobileOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full justify-center">Sign in</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMobileOpen(false)}>
                  <Button size="sm" className="w-full justify-center">Get started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
