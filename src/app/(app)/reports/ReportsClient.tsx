'use client';

import React from 'react';
import { FileText, Download, Mail, Filter, FileSpreadsheet, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ReportsClientProps {
  candidates: any[];
  jobs: any[];
}

export function ReportsClient({ candidates, jobs }: ReportsClientProps) {
  const downloadCSV = (type: 'ranking' | 'pipeline') => {
    let headers: string[] = [];
    let rows: any[][] = [];

    if (type === 'ranking') {
      headers = ['Name', 'Email', 'Job Title', 'Status', 'AI Score', 'Applied Date'];
      rows = candidates
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .map(c => [
          c.name || 'Unknown',
          c.email || '',
          c.job_title || 'Unknown Job',
          c.status,
          c.score || 0,
          new Date(c.created_at).toLocaleDateString()
        ]);
    } else if (type === 'pipeline') {
      headers = ['Job Title', 'Total Candidates', 'Shortlisted', 'Pending', 'Rejected'];
      rows = jobs.map(j => {
        const jobCandidates = candidates.filter(c => c.job_id === j.id);
        const shortlisted = jobCandidates.filter(c => c.status === 'shortlisted').length;
        const pending = jobCandidates.filter(c => c.status === 'pending').length;
        const rejected = jobCandidates.filter(c => c.status === 'rejected').length;
        return [
          j.title,
          jobCandidates.length,
          shortlisted,
          pending,
          rejected
        ];
      });
    }

    const csvContent = [headers, ...rows]
      .map(e => e.map(item => `"${String(item).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const reports = [
    {
      id: 'pipeline-audit',
      title: 'Hiring Pipeline Summary',
      description: 'Comprehensive overview of applications and hiring efficiency by job.',
      lastRun: 'Just now',
      type: 'Executive',
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      color: 'blue',
      action: () => downloadCSV('pipeline')
    },
    {
      id: 'candidate-ranking',
      title: 'Candidate Ranking Export',
      description: 'Detailed list of candidates with AI scores and statuses.',
      lastRun: 'Just now',
      type: 'Data',
      icon: <FileSpreadsheet className="w-5 h-5 text-emerald-600" />,
      color: 'emerald',
      action: () => downloadCSV('ranking')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Reporting Hub</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Reports & Export
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Generate and download data-driven reports for your hiring process.
          </p>
        </div>
        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-md">
          <Filter className="w-4 h-4" />
          Report Builder
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Reports List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Available Reports</h2>
          {reports.map((report) => (
            <div 
              key={report.id}
              className="group flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111318]/80 hover:shadow-lg transition-all duration-300 backdrop-blur-xl"
            >
              <div className={`p-4 rounded-2xl bg-${report.color}-500/10 shrink-0`}>
                {report.icon}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {report.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800">
                    {report.type}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                  {report.description}
                </p>
                <div className="flex items-center gap-4 pt-2 text-[10px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Live Data
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Auto-sync enabled
                  </span>
                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <Button onClick={report.action} variant="outline" className="gap-2 flex-1 md:flex-none border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <FileSpreadsheet className="w-4 h-4" /> Export CSV
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Scheduled Reports Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-8">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Scheduled Deliveries</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800">
                <Mail className="w-4 h-4 text-blue-600 mt-1" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Weekly Pipeline Update</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Every Monday at 9:00 AM</p>
                </div>
              </div>
              <Button variant="outline" className="w-full text-xs font-bold py-2 h-auto mt-2 border-slate-200 dark:border-slate-700">
                Manage Schedules
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-lg shadow-blue-500/20">
            <h3 className="font-bold mb-2">Custom Exports</h3>
            <p className="text-xs text-blue-100 mb-6 leading-relaxed">
              Need a specific dataset? Use our API or the custom builder to filter exactly what you need.
            </p>
            <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 border-none font-bold">
              Open Query Builder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
