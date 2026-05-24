import React from 'react';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';

interface SkillExtractorProps {
  foundSkills: string[];
  missingSkills: string[];
  animate?: boolean;
}

export function SkillExtractor({ foundSkills, missingSkills, animate = true }: SkillExtractorProps) {
  return (
    <div className="space-y-5">
      {/* Found Skills */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Matched Skills ({foundSkills.length})
          </h4>
        </div>
        {foundSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {foundSkills.map((skill, i) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30"
                style={animate ? { animationDelay: `${i * 50}ms`, animation: 'fadeSlideIn 0.3s ease-out both' } : {}}
              >
                <Sparkles className="w-3 h-3" />
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic">No exact skill matches found.</p>
        )}
      </div>

      {/* Missing Skills */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <XCircle className="w-4 h-4 text-rose-500" />
          <h4 className="text-sm font-semibold text-rose-600 dark:text-rose-400">
            Missing Skills ({missingSkills.length})
          </h4>
        </div>
        {missingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, i) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30"
                style={animate ? { animationDelay: `${i * 50}ms`, animation: 'fadeSlideIn 0.3s ease-out both' } : {}}
              >
                <XCircle className="w-3 h-3" />
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">✓ All required skills are present!</p>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}