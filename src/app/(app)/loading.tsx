'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse w-full">
      {/* Top Animated Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[9999] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-[length:200%_auto] animate-loading-bar" />

      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-3 flex-1">
          {/* Badge */}
          <div className="w-24 h-5 bg-slate-200 dark:bg-slate-800 rounded-full" />
          {/* Title */}
          <div className="h-10 md:h-12 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          {/* Description */}
          <div className="h-5 w-80 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
        {/* Action Button */}
        <div className="w-36 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl shrink-0" />
      </div>

      {/* Stats Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="p-6 rounded-2xl bg-white/50 dark:bg-[#111318]/50 border border-slate-100 dark:border-slate-800 space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="w-5 h-5 rounded-lg bg-slate-100 dark:bg-slate-900" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-3 w-20 bg-slate-100 dark:bg-slate-900 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Content Area Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(2)].map((_, idx) => (
          <div 
            key={idx} 
            className="p-6 rounded-2xl bg-white/50 dark:bg-[#111318]/50 border border-slate-100 dark:border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-3.5 w-24 bg-slate-100 dark:bg-slate-900 rounded" />
              </div>
              <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
            
            <div className="space-y-3 pt-2">
              {[...Array(4)].map((_, row) => (
                <div key={row} className="flex items-center gap-3 py-1">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-24 bg-slate-100 dark:bg-slate-900 rounded" />
                  </div>
                  <div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add custom CSS rules for the moving loading bar in globals.css/layout */}
      <style jsx global>{`
        @keyframes loading-bar {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-loading-bar {
          animation: loading-bar 2s ease infinite;
        }
      `}</style>
    </div>
  );
}
