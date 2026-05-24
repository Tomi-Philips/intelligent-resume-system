'use client';

import React, { useState, useEffect } from 'react';
import { CandidateWithDetails } from '@/services/candidate.service';
import { CandidateCard } from '@/components/candidates/CandidateCard';
import { CandidateTable } from '@/components/candidates/CandidateTable';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  Search, LayoutGrid, List, Sparkles, Download,
  Users, CheckCircle2, Clock, TrendingUp
} from 'lucide-react';

interface CandidateFiltersProps {
  initialCandidates: CandidateWithDetails[];
}

export function CandidateFilters({ initialCandidates }: CandidateFiltersProps) {
  const [candidates] = useState(initialCandidates);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'score' | 'newest'>('score');

  const filtered = candidates
    .filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (c.name?.toLowerCase() ?? '').includes(q) ||
        (c.email?.toLowerCase() ?? '').includes(q) ||
        (c.job_title?.toLowerCase() ?? '').includes(q);
      const matchesStatus =
        statusFilter === 'all' || c.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return (b.score ?? 0) - (a.score ?? 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Score', 'Job', 'Applied'];
    const rows = filtered.map((c) => [
      c.name ?? '',
      c.email ?? '',
      c.phone ?? '',
      c.status,
      c.score ?? 0,
      c.job_title ?? '',
      new Date(c.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidates-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shortlisted = candidates.filter((c) => c.status.toLowerCase() === 'shortlisted').length;
  const pending = candidates.filter((c) => c.status.toLowerCase() === 'pending').length;
  const topScore = candidates.length > 0 ? Math.max(...candidates.map((c) => c.score ?? 0)) : 0;

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total', value: candidates.length, color: 'text-blue-600 bg-blue-500/10 border-blue-500/20' },
          { icon: CheckCircle2, label: 'Shortlisted', value: shortlisted, color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' },
          { icon: Clock, label: 'Pending', value: pending, color: 'text-amber-600 bg-amber-500/10 border-amber-500/20' },
          { icon: TrendingUp, label: 'Top Score', value: `${topScore}%`, color: 'text-purple-600 bg-purple-500/10 border-purple-500/20' },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="border-0 shadow-lg bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter bar */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name, email, or job..."
                className="pl-9 h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* View toggle */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 px-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-11 px-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
              >
                <option value="score">Highest Score</option>
                <option value="newest">Newest First</option>
              </select>

              <Button
                variant="outline"
                onClick={exportCSV}
                className="h-11 px-4 gap-2 rounded-xl border-slate-200 dark:border-slate-800"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#111318] rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No candidates found</h3>
          <p className="text-slate-500">Try adjusting your filters or search query.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          <CandidateTable candidates={filtered} />
        </Card>
      )}
    </>
  );
}
