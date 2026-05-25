'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
  BarChart3,
  HelpCircle,
  Zap,
  Crown
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { name, email, signOut } = useAuth();
  const [candidateCount, setCandidateCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCount() {
      try {
        const { count, error } = await supabase
          .from('candidates')
          .select('*', { count: 'exact', head: true });
        if (!error && count !== null) {
          setCandidateCount(count);
        }
      } catch (err) {
        console.error('Error fetching candidate count in sidebar:', err);
      }
    }
    fetchCount();
  }, []);

  const getInitials = (userName: string) => {
    const parts = userName.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return userName.slice(0, 2).toUpperCase();
  };

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/jobs', label: 'Jobs', icon: Briefcase },
    { href: '/candidates', label: 'Candidates', icon: Users },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/reports', label: 'Reports', icon: FileText },
  ];

  const secondaryLinks = [
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div 
      className={`relative h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-300 flex flex-col transition-all duration-300 shadow-2xl ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-50 w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-600 text-slate-300 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 hover:scale-110"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>

      {/* Logo Section */}
      <div className={`p-6 ${collapsed ? 'px-4' : ''}`}>
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">H</span>
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-white font-bold text-xl tracking-tight">HireFlow</span>
              <span className="text-xs text-blue-400 font-medium">v2.0</span>
            </div>
          )}
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-1 mt-6">
        <div className={`${collapsed ? 'text-center' : 'px-3'} mb-4`}>
          {!collapsed && (
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Main Menu</p>
          )}
          {collapsed && <div className="w-full h-px bg-slate-700" />}
        </div>
        
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 shadow-lg shadow-blue-500/10' 
                  : 'hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <div className={`relative ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-white'} transition-colors`}>
                <Icon className="w-5 h-5" />
                {isActive && (
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
                )}
              </div>
              {!collapsed && (
                <span className={`${isActive ? 'text-blue-400' : ''}`}>
                  {link.label}
                </span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                  {link.label}
                </div>
              )}
              {!collapsed && isActive && (
                <Zap className="w-3 h-3 text-blue-400 ml-auto" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* AI Insight Box */}
      {!collapsed && (
        <div className="mx-4 my-4 p-4 rounded-xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-blue-400">AI Insight</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            You have <span className="text-blue-400 font-bold">{candidateCount !== null ? `${candidateCount} candidates` : 'new candidates'}</span> matched for your active positions.
          </p>
        </div>
      )}

      {/* Secondary Navigation & User Section */}
      <div className="mt-auto">
        <div className={`${collapsed ? 'px-3' : 'px-4'} mb-4`}>
          {!collapsed && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg text-sm shrink-0">
                {getInitials(name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{name}</p>
                <div className="flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-500" />
                  <p className="text-xs text-slate-400">Admin Plan</p>
                </div>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg">
              {getInitials(name)}
            </div>
          )}
        </div>

        <div className={`space-y-1 px-3 pb-6`}>
          {secondaryLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-500 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {!collapsed && <span>{link.label}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {link.label}
                  </div>
                )}
              </Link>
            );
          })}
          
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-rose-400 hover:bg-rose-500/10 group relative"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Sign Out</span>}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-rose-500 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Sign Out
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}