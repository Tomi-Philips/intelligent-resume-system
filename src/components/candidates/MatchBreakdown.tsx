import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { AIInsights } from '../../services/candidate.service';
import { CheckCircle2, XCircle } from 'lucide-react';

interface MatchBreakdownProps {
  insights: AIInsights;
}

export function MatchBreakdown({ insights }: MatchBreakdownProps) {
  return (
    <div className="space-y-6">
      <Card className="glass-panel border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">AI Summary</h4>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {insights.summary}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-emerald-600 dark:text-emerald-400 text-lg">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Found Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.found_skills.length > 0 ? (
                insights.found_skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full text-sm font-medium border border-emerald-100 dark:border-emerald-800/50">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 italic text-sm">No exact skill matches found.</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-red-600 dark:text-red-400 text-lg">
              <XCircle className="w-5 h-5 mr-2" />
              Missing Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.missing_skills.length > 0 ? (
                insights.missing_skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full text-sm font-medium border border-red-100 dark:border-red-800/50">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 italic text-sm">All required skills met!</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
