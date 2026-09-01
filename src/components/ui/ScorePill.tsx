import React from 'react';
import { Sparkles } from 'lucide-react';

interface ScorePillProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function ScorePill({
  score,
  size = 'md',
  showIcon = true,
  className = '',
}: ScorePillProps) {
  let colorStyles = 'bg-zinc-100 text-zinc-700 border-zinc-200';
  if (score >= 80) {
    colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (score >= 60) {
    colorStyles = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (score >= 40) {
    colorStyles = 'bg-amber-50 text-amber-700 border-amber-200';
  } else {
    colorStyles = 'bg-rose-50 text-rose-700 border-rose-200';
  }

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-semibold gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-bold gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${sizeStyles[size]} ${colorStyles} ${className}`}
    >
      {showIcon && <Sparkles className="w-3.5 h-3.5 shrink-0 opacity-80" />}
      <span>{score}% Match</span>
    </span>
  );
}
