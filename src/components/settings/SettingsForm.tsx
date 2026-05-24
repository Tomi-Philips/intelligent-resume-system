'use client';

import React from 'react';
import { User, Bell, Shield, Globe, CreditCard, Save, Smartphone, Laptop } from 'lucide-react';
import { Button } from '../ui/Button';

export function SettingsForm() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <SettingsNavItem icon={<User className="w-4 h-4" />} label="Profile Details" active />
          <SettingsNavItem icon={<Bell className="w-4 h-4" />} label="Notifications" />
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <section className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="John Recruiter"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="john@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
                <textarea 
                  rows={4}
                  defaultValue="Talent Acquisition Specialist with 5+ years of experience in tech hiring."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </section>

          <section className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">AI Configuration</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Auto-Score Candidates</p>
                  <p className="text-xs text-slate-500">Automatically run AI analysis on every new upload.</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Smart Match Recommendations</p>
                  <p className="text-xs text-slate-500">Suggest candidates based on previous successful hires.</p>
                </div>
                <div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <Button variant="ghost">Cancel</Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsNavItem({ icon, label, active }: any) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
    }`}>
      {icon}
      {label}
    </button>
  );
}
