import React from 'react';
import { candidateService } from '@/services/candidate.service';
import { Card, CardContent } from '../ui/Card';
import { Briefcase, Users, CheckCircle2, TrendingUp, ArrowUpRight, Sparkles, BarChart3, Target, Award, Zap } from 'lucide-react';

export async function StatsCards({ supabase }: { supabase?: any }) {
  let stats = { totalJobs: 0, totalCandidates: 0, shortlistedCount: 0, avgScore: 0 };

  try {
    stats = await candidateService.getDashboardStats(supabase);
  } catch (e) {
    console.error('StatsCards fetch error:', e);
  }

  // Calculate additional insights
  const conversionRate = stats.totalCandidates > 0
    ? Math.round((stats.shortlistedCount / stats.totalCandidates) * 100)
    : 0;
  
  const getScoreTrend = () => {
    if (stats.avgScore >= 80) return 'Excellent matching';
    if (stats.avgScore >= 60) return 'Good match quality';
    if (stats.avgScore >= 40) return 'Average matches';
    return 'Needs improvement';
  };

  const cards = [
    {
      label: 'Active Jobs',
      value: stats.totalJobs.toString(),
      icon: Briefcase,
      iconBg: 'from-blue-500 to-indigo-600',
      iconColor: 'text-white',
      gradient: 'from-blue-500/10 to-indigo-500/10',
      border: 'border-blue-500/20',
      trend: 'Open positions',
      trendIcon: <Briefcase className="w-3 h-3" />,
      accentColor: 'from-blue-500 to-indigo-600',
      description: 'Currently hiring',
    },
    {
      label: 'Total Candidates',
      value: stats.totalCandidates.toString(),
      icon: Users,
      iconBg: 'from-indigo-500 to-purple-600',
      iconColor: 'text-white',
      gradient: 'from-indigo-500/10 to-purple-500/10',
      border: 'border-indigo-500/20',
      trend: 'In pipeline',
      trendIcon: <Users className="w-3 h-3" />,
      accentColor: 'from-indigo-500 to-purple-600',
      description: 'Total applicants',
    },
    {
      label: 'Shortlisted',
      value: stats.shortlistedCount.toString(),
      icon: CheckCircle2,
      iconBg: 'from-emerald-500 to-teal-600',
      iconColor: 'text-white',
      gradient: 'from-emerald-500/10 to-teal-500/10',
      border: 'border-emerald-500/20',
      trend: `${conversionRate}% conversion rate`,
      trendIcon: <Target className="w-3 h-3" />,
      accentColor: 'from-emerald-500 to-teal-600',
      description: 'Top candidates',
    },
    {
      label: 'Avg. Match Score',
      value: `${stats.avgScore}%`,
      icon: TrendingUp,
      iconBg: 'from-amber-500 to-orange-600',
      iconColor: 'text-white',
      gradient: 'from-amber-500/10 to-orange-500/10',
      border: 'border-amber-500/20',
      trend: getScoreTrend(),
      trendIcon: <Sparkles className="w-3 h-3" />,
      accentColor: 'from-amber-500 to-orange-600',
      description: 'AI-powered scoring',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.trendIcon;
        return (
          <Card
            key={card.label}
            className="group relative overflow-hidden border-0 shadow-xl shadow-slate-200/40 dark:shadow-black/40 bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Animated Gradient Border */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            {/* Background Glow Effect */}
            <div className={`absolute -top-20 -right-20 w-32 h-32 bg-gradient-to-br ${card.accentColor} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-700`} />

            <CardContent className="p-6 relative z-10">
              {/* Icon and Arrow */}
              <div className="flex items-center justify-between mb-4">
                <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${card.iconColor}`} />
                  {/* Pulsing dot for active status */}
                  {card.label === 'Active Jobs' && stats.totalJobs > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors">
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              {/* Stats Value with Animation */}
              <div className="space-y-1">
                <p className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left">
                  {card.value}
                </p>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {card.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {card.description}
                </p>
              </div>

              {/* Trend Indicator */}
              {card.trend && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-lg bg-gradient-to-br ${card.accentColor} flex items-center justify-center`}>
                      {TrendIcon}
                    </div>
                    <p className={`text-xs font-medium ${
                      card.label === 'Shortlisted' 
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : card.label === 'Avg. Match Score'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {card.trend}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>

            {/* Hover Reveal Extra Info */}
            <div className="absolute bottom-0 left-0 right-0 h-0 group-hover:h-12 transition-all duration-300 overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${card.gradient} flex items-center justify-center gap-2`}>
                <Zap className="w-3 h-3 text-slate-500" />
                <p className="text-[10px] font-medium text-slate-500">
                  {card.label === 'Active Jobs' && 'Post new jobs to attract talent'}
                  {card.label === 'Total Candidates' && `${stats.totalCandidates} candidates in database`}
                  {card.label === 'Shortlisted' && `${stats.shortlistedCount} candidates shortlisted`}
                  {card.label === 'Avg. Match Score' && 'Based on AI semantic matching'}
                </p>
              </div>
            </div>
          </Card>
        );
      })}

    </div>
  );
}