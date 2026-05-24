import React from 'react';

interface RankingVisualizerProps {
  scoreDistribution: { range: string; count: number }[];
}

export function RankingVisualizer({ scoreDistribution }: RankingVisualizerProps) {
  const maxCount = Math.max(...scoreDistribution.map((b) => b.count), 1);

  const barColors = [
    'from-rose-500 to-pink-500',
    'from-orange-500 to-amber-500',
    'from-yellow-500 to-amber-400',
    'from-blue-500 to-indigo-500',
    'from-emerald-500 to-teal-500',
  ];

  if (scoreDistribution.every((b) => b.count === 0)) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
        No score data yet. Upload and analyze resumes.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {scoreDistribution.map((bucket, i) => (
        <div key={bucket.range} className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-16 shrink-0 text-right">
            {bucket.range}%
          </span>
          <div className="flex-1 h-7 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
            <div
              className={`h-full rounded-lg bg-gradient-to-r ${barColors[i]} transition-all duration-700 ease-out flex items-center justify-end pr-2`}
              style={{ width: `${(bucket.count / maxCount) * 100}%` }}
            >
              {bucket.count > 0 && (
                <span className="text-white text-xs font-bold">{bucket.count}</span>
              )}
            </div>
          </div>
          {bucket.count === 0 && (
            <span className="text-xs text-slate-400">0</span>
          )}
        </div>
      ))}
    </div>
  );
}