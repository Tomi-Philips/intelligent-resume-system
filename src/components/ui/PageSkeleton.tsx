import React from 'react';

/** Thin animated progress bar pinned to the top of the viewport */
function TopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 z-[9999] overflow-hidden">
      <div className="h-full w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-[loading-bar_1.4s_ease_infinite] bg-[length:200%_auto]" />
    </div>
  );
}

/** Generic pulsing block */
function Bone({ className }: { className: string }) {
  return <div className={`rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse ${className}`} />;
}

/* ─── Variant: Form page (create job, settings, upload) ─── */
export function FormPageSkeleton() {
  return (
    <>
      <TopBar />
      <div className="container mx-auto py-8 px-4 max-w-4xl space-y-8">
        {/* Back link */}
        <Bone className="h-8 w-32" />

        {/* Title block */}
        <div className="space-y-3">
          <Bone className="h-5 w-24 rounded-full" />
          <Bone className="h-12 w-64" />
          <Bone className="h-5 w-80" />
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/80 dark:bg-[#111318]/80 border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl">
          <Bone className="h-1.5 w-full rounded-none" />
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <Bone className="h-4 w-24" />
              <Bone className="h-12 w-full" />
            </div>
            <div className="space-y-2">
              <Bone className="h-4 w-32" />
              <Bone className="h-40 w-full" />
            </div>
            <div className="space-y-2">
              <Bone className="h-4 w-28" />
              <Bone className="h-12 w-full" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Bone className="h-11 w-24" />
              <Bone className="h-11 w-32" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Variant: List page (jobs list, candidates list) ─── */
export function ListPageSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      <TopBar />
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <Bone className="h-5 w-20 rounded-full" />
            <Bone className="h-10 w-52" />
            <Bone className="h-4 w-72" />
          </div>
          <Bone className="h-11 w-36 shrink-0" />
        </div>

        {/* Filters row */}
        <div className="flex gap-3">
          <Bone className="h-10 flex-1" />
          <Bone className="h-10 w-28" />
          <Bone className="h-10 w-28" />
        </div>

        {/* Rows */}
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white/80 dark:bg-[#111318]/80 border border-slate-100 dark:border-slate-800 flex items-center gap-4"
            >
              <Bone className="w-12 h-12 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Bone className="h-4 w-48" />
                <Bone className="h-3 w-32" />
              </div>
              <Bone className="h-7 w-20 rounded-full" />
              <Bone className="h-8 w-8 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Variant: Detail page (job detail) ─── */
export function DetailPageSkeleton() {
  return (
    <>
      <TopBar />
      <div className="space-y-8 max-w-5xl">
        {/* Back */}
        <Bone className="h-8 w-32" />

        {/* Hero header */}
        <div className="rounded-2xl bg-white/80 dark:bg-[#111318]/80 border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl">
          <Bone className="h-1.5 w-full rounded-none" />
          <div className="p-8 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 flex-1">
                <Bone className="h-5 w-20 rounded-full" />
                <Bone className="h-10 w-72" />
                <Bone className="h-4 w-96" />
              </div>
              <Bone className="h-11 w-36 shrink-0" />
            </div>
            <div className="flex gap-3 pt-2">
              {[80, 60, 72].map((w) => (
                <Bone key={w} className={`h-7 w-${w === 80 ? '24' : w === 60 ? '20' : '28'} rounded-full`} />
              ))}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/80 dark:bg-[#111318]/80 border border-slate-100 dark:border-slate-800 space-y-3">
              <Bone className="w-10 h-10 rounded-xl" />
              <Bone className="h-7 w-12" />
              <Bone className="h-3 w-20" />
            </div>
          ))}
        </div>

        {/* Content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4 p-6 rounded-2xl bg-white/80 dark:bg-[#111318]/80 border border-slate-100 dark:border-slate-800">
            {Array.from({ length: 6 }).map((_, i) => (
              <Bone key={i} className={`h-4 ${i % 3 === 2 ? 'w-3/4' : 'w-full'}`} />
            ))}
          </div>
          <div className="space-y-4 p-6 rounded-2xl bg-white/80 dark:bg-[#111318]/80 border border-slate-100 dark:border-slate-800">
            <Bone className="h-5 w-24" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Bone key={i} className="h-8 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Variant: Upload page ─── */
export function UploadPageSkeleton() {
  return (
    <>
      <TopBar />
      <div className="container mx-auto py-8 px-4 max-w-5xl space-y-8">
        <Bone className="h-8 w-36" />
        <div className="space-y-3">
          <Bone className="h-5 w-24 rounded-full" />
          <Bone className="h-12 w-56" />
          <Bone className="h-5 w-80" />
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex gap-3 items-start">
              <Bone className="w-8 h-8 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Bone className="h-4 w-24" />
                <Bone className="h-3 w-36" />
              </div>
            </div>
          ))}
        </div>

        {/* Drop zone card */}
        <div className="rounded-2xl bg-white/80 dark:bg-[#111318]/80 border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl">
          <Bone className="h-1.5 w-full rounded-none" />
          <div className="p-8 space-y-6">
            <Bone className="h-6 w-32" />
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl h-48 flex flex-col items-center justify-center gap-3">
              <Bone className="w-12 h-12 rounded-xl" />
              <Bone className="h-5 w-40" />
              <Bone className="h-4 w-52" />
              <Bone className="h-10 w-32 mt-2" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Variant: Dashboard ─── */
export function DashboardPageSkeleton() {
  return (
    <>
      <TopBar />
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <Bone className="h-5 w-20 rounded-full" />
            <Bone className="h-12 w-64" />
            <Bone className="h-5 w-80" />
          </div>
          <Bone className="h-11 w-36 shrink-0" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/50 dark:bg-[#111318]/50 border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <Bone className="w-12 h-12 rounded-xl" />
                <Bone className="w-5 h-5 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Bone className="h-8 w-16" />
                <Bone className="h-4 w-28" />
                <Bone className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>

        {/* Secondary panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white/50 dark:bg-[#111318]/50 border border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-2">
                  <Bone className="h-6 w-32" />
                  <Bone className="h-3.5 w-24" />
                </div>
                <Bone className="h-4 w-12" />
              </div>
              <div className="space-y-3 pt-2">
                {Array.from({ length: 4 }).map((_, row) => (
                  <div key={row} className="flex items-center gap-3 py-1">
                    <Bone className="w-10 h-10 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Bone className="h-4 w-32" />
                      <Bone className="h-3 w-24" />
                    </div>
                    <Bone className="w-12 h-6 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
