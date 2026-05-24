import React from 'react';
import { Sparkles, TrendingUp, Target, AlertCircle, CheckCircle2, Zap, BarChart3, Lightbulb } from 'lucide-react';

interface JobDescriptionAnalyzerProps {
  requiredSkills: string[];
  experienceLevel?: string | null;
  description?: string;
}

export function JobDescriptionAnalyzer({ requiredSkills, experienceLevel, description }: JobDescriptionAnalyzerProps) {
  const wordCount = description?.split(/\s+/).filter(Boolean).length ?? 0;
  const qualityScore = Math.min(
    100,
    (requiredSkills.length >= 5 ? 40 : requiredSkills.length * 8) +
      (experienceLevel ? 20 : 0) +
      (wordCount >= 100 ? 40 : Math.floor((wordCount / 100) * 40))
  );

  const qualityLabel =
    qualityScore >= 80 ? 'Excellent' : qualityScore >= 60 ? 'Good' : qualityScore >= 40 ? 'Fair' : 'Needs Improvement';

  const qualityConfig = {
    Excellent: {
      color: 'emerald',
      icon: CheckCircle2,
      message: 'Your job description is well-optimized for AI matching!'
    },
    Good: {
      color: 'blue',
      icon: TrendingUp,
      message: 'Good foundation. A few improvements will boost match accuracy.'
    },
    Fair: {
      color: 'amber',
      icon: AlertCircle,
      message: 'Consider adding more details to improve candidate matching.'
    },
    'Needs Improvement': {
      color: 'rose',
      icon: AlertCircle,
      message: 'Your JD needs more detail to attract the right candidates.'
    }
  };

  const config = qualityConfig[qualityLabel as keyof typeof qualityConfig];
  const Icon = config.icon;
  const barColor = 
    qualityScore >= 80 ? 'from-emerald-500 to-teal-500'
    : qualityScore >= 60 ? 'from-blue-500 to-indigo-500'
    : qualityScore >= 40 ? 'from-amber-500 to-orange-500'
    : 'from-rose-500 to-pink-500';

  // Calculate specific recommendations
  const recommendations = [];
  if (requiredSkills.length < 5) {
    recommendations.push(`Add ${5 - requiredSkills.length} more required skills for better matching`);
  }
  if (!experienceLevel) {
    recommendations.push('Specify the experience level (e.g., Junior, Senior)');
  }
  if (wordCount < 100) {
    recommendations.push(`Add ${100 - wordCount} more words to your description`);
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-[#111318]/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
      {/* Decorative Top Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${barColor}`} />
      
      {/* Background Glow */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 bg-${config.color}-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${barColor} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0`}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">JD Quality Score</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">AI-powered analysis</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-${config.color}-50 dark:bg-${config.color}-900/20 border border-${config.color}-200 dark:border-${config.color}-800 w-fit shrink-0`}>
            <Icon className={`w-3.5 h-3.5 text-${config.color}-600 dark:text-${config.color}-400`} />
            <span className={`text-xs font-bold text-${config.color}-700 dark:text-${config.color}-300 whitespace-nowrap`}>
              {qualityLabel}
            </span>
          </div>
        </div>

        {/* Score Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Overall Quality Score</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{qualityScore}</span>
              <span className="text-xs text-slate-500">/100</span>
            </div>
          </div>
          <div className="relative h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000 ease-out`}
              style={{ width: `${qualityScore}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <p className={`text-xs text-${config.color}-600 dark:text-${config.color}-400 mt-1 flex items-center gap-1`}>
            <Lightbulb className="w-3 h-3" />
            {config.message}
          </p>
        </div>

        {/* Checklist */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Optimization Checklist</p>
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            {/* Skills Checklist Item */}
            <div className={`flex-1 min-w-[140px] flex items-center gap-2.5 p-2.5 rounded-xl transition-all duration-200 ${
              requiredSkills.length >= 5 
                ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20' 
                : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700'
            }`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                requiredSkills.length >= 5 
                  ? 'bg-emerald-500 text-white shadow-sm' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
              }`}>
                {requiredSkills.length >= 5 ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-bold">{requiredSkills.length}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className={`text-[11px] font-bold leading-tight ${
                  requiredSkills.length >= 5 
                    ? 'text-emerald-700 dark:text-emerald-400' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  Skills
                </p>
                <p className="text-[10px] text-slate-400 truncate">5+ required</p>
              </div>
            </div>

            {/* Experience Checklist Item */}
            <div className={`flex-1 min-w-[140px] flex items-center gap-2.5 p-2.5 rounded-xl transition-all duration-200 ${
              experienceLevel 
                ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20' 
                : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700'
            }`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                experienceLevel 
                  ? 'bg-emerald-500 text-white shadow-sm' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
              }`}>
                {experienceLevel ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-bold">!</span>
                )}
              </div>
              <div className="min-w-0">
                <p className={`text-[11px] font-bold leading-tight ${
                  experienceLevel 
                    ? 'text-emerald-700 dark:text-emerald-400' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  Experience
                </p>
                <p className="text-[10px] text-slate-400 truncate">Seniority set</p>
              </div>
            </div>

            {/* Length Checklist Item */}
            <div className={`flex-1 min-w-[140px] flex items-center gap-2.5 p-2.5 rounded-xl transition-all duration-200 ${
              wordCount >= 100 
                ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20' 
                : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700'
            }`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                wordCount >= 100 
                  ? 'bg-emerald-500 text-white shadow-sm' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
              }`}>
                {wordCount >= 100 ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className="text-[10px] font-bold">{wordCount}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className={`text-[11px] font-bold leading-tight ${
                  wordCount >= 100 
                    ? 'text-emerald-700 dark:text-emerald-400' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  Length
                </p>
                <p className="text-[10px] text-slate-400 truncate">100+ words</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border border-blue-500/10">
              <Zap className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">Quick Improvements</p>
                <ul className="space-y-1">
                  {recommendations.map((rec, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-blue-500" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Progress Summary */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              AI Readiness
            </span>
            <span>{Math.floor((requiredSkills.filter(s => s).length / 5) * 100)}% Skills • {wordCount >= 100 ? '100%' : `${Math.floor((wordCount / 100) * 100)}%`} Length</span>
          </div>
        </div>
      </div>
    </div>
  );
}