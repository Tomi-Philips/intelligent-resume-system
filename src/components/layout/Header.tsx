
'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Search, Menu, X, User, Settings, LogOut, Moon, Sun, ChevronDown } from 'lucide-react';
import { Input } from '../ui/Input';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Create a simple breadcrumb/title from pathname
  const pathParts = pathname.split('/').filter(Boolean);
  const title = pathParts.length > 0
    ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1)
    : 'Overview';

  const notifications = [
    { id: 1, title: 'New candidate matched', message: 'Alice Johnson scored 92% for Senior Frontend', time: '5 min ago', read: false },
    { id: 2, title: 'Job posting expired', message: 'Backend Developer position has been closed', time: '1 hour ago', read: false },
    { id: 3, title: 'Interview scheduled', message: 'Michael Chen - Technical Interview at 2PM', time: '3 hours ago', read: true },
  ];

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-2">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>/</span>
            {pathParts.slice(1).map((part, idx) => (
              <React.Fragment key={idx}>
                <span className="capitalize">{part.replace(/-/g, ' ')}</span>
                {idx < pathParts.slice(1).length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search - Desktop */}
        <div className="relative hidden md:block w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search candidates, jobs, or settings..."
            className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-10 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md font-mono">
            ⌘K
          </kbd>
        </div>

        {/* Search - Mobile Toggle */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="md:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse"></span>
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setNotificationsOpen(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-40">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Mark all read</button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{notification.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{notification.message}</p>
                          <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-slate-200 dark:border-slate-700">
                  <button className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">View all notifications</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
              RU
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">Recruiter User</p>
              <p className="text-xs text-slate-500">recruiter@minded.ai</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
          </button>

          {/* User Dropdown */}
          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-40">
                <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Recruiter User</p>
                  <p className="text-xs text-slate-500">recruiter@minded.ai</p>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </button>
                  <hr className="my-2 border-slate-200 dark:border-slate-700" />
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="absolute top-16 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search candidates or jobs..."
              className="pl-9 bg-slate-50 dark:bg-slate-800 border-none h-10 rounded-xl w-full"
              autoFocus
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}