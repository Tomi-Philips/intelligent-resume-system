import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200 bg-white mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <Logo />
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              A recruitment platform that helps companies find and evaluate the right candidates.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/jobs" className="hover:text-zinc-900 transition-colors">Browse Jobs</Link></li>
              <li><Link href="/login" className="hover:text-zinc-900 transition-colors">Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-zinc-900 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
              For Companies
            </h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/signup" className="hover:text-zinc-900 transition-colors">Register</Link></li>
              <li><Link href="/company/jobs" className="hover:text-zinc-900 transition-colors">Post a Vacancy</Link></li>
              <li><Link href="/company/dashboard" className="hover:text-zinc-900 transition-colors">Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-2">
          <p>&copy; {new Date().getFullYear()} HireLogic</p>
          <p>The company retains hiring authority over all recruitment decisions.</p>
        </div>
      </div>
    </footer>
  );
};
