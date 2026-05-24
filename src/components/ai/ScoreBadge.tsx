import React from 'react';

interface ScoreBadgeProps {
  score: number | null;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
  if (score === null) {
    return <span className="text-slate-400 italic text-sm">Not scored</span>;
  }

  let colorClass = 'bg-slate-100 text-slate-800 border-slate-200';
  
  if (score >= 80) {
    colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
  } else if (score >= 50) {
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
  } else {
    colorClass = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5 font-bold'
  };

  return (
    <div className={`inline-flex items-center justify-center font-semibold rounded-full border ${colorClass} ${sizes[size]}`}>
      {score}% Match
    </div>
  );
}
