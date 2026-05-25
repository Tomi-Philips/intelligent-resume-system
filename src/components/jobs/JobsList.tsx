'use client';

import React, { useState } from 'react';
import { Job } from '@/types/job';
import { JobCard } from './JobCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Search, Briefcase, Plus, Filter, Download, X, HelpCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface JobsListProps {
  initialJobs: Job[];
}

type StatusFilter = 'all' | 'open' | 'closed';

export function JobsList({ initialJobs }: JobsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<string>('all');

  // Filter jobs based on search query, status, and experience level
  const filteredJobs = initialJobs.filter((job) => {
    // 1. Search Query Filter
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      job.title.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query) ||
      (job.experience_level && job.experience_level.toLowerCase().includes(query)) ||
      job.required_skills.some(skill => skill.toLowerCase().includes(query));

    // 2. Status Filter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'open' && job.status !== 'closed') ||
      (statusFilter === 'closed' && job.status === 'closed');

    // 3. Experience Level Filter
    const matchesExperience = selectedExperience === 'all' ||
      (job.experience_level && job.experience_level.toLowerCase().includes(selectedExperience.toLowerCase()));

    return matchesSearch && matchesStatus && matchesExperience;
  });

  // Extract unique experience levels for filters
  const experienceLevels = Array.from(
    new Set(
      initialJobs
        .map((j) => j.experience_level)
        .filter((exp): exp is string => !!exp)
    )
  );

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSelectedExperience('all');
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Live Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs by title, skills, experience..." 
            className="pl-10 h-11 bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 w-full"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 relative shrink-0">
          {/* Status Quick Filter Selector */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all' 
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('open')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'open' 
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('closed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'closed' 
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Closed
            </button>
          </div>

          <Button 
            variant="outline" 
            onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
            className={`h-11 px-4 border-slate-200 dark:border-slate-800 rounded-xl transition-all ${
              showFiltersDropdown || selectedExperience !== 'all'
                ? 'bg-blue-50/50 border-blue-200 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/30 dark:text-blue-400'
                : ''
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
            {selectedExperience !== 'all' && (
              <span className="ml-1.5 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            )}
          </Button>

          {/* Advanced Filters Dropdown */}
          {showFiltersDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowFiltersDropdown(false)} />
              <div className="absolute right-0 top-12 w-64 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-20 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Filters</h4>
                  <button 
                    onClick={resetFilters}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Experience Level</label>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-200"
                  >
                    <option value="all">All Levels</option>
                    {experienceLevels.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Info Stats Bar */}
      {(searchQuery || statusFilter !== 'all' || selectedExperience !== 'all') && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-500">
          <p>
            Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredJobs.length}</span> of{' '}
            <span className="font-semibold">{initialJobs.length}</span> positions matching filters.
          </p>
          <button 
            onClick={resetFilters}
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            Reset Filters <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-20 bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 transition-all duration-300">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center">
            <Briefcase className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">No matching jobs</h3>
          <p className="text-slate-500 mt-2 mb-6 max-w-sm mx-auto">
            Try adjusting your search query, status filters, or experience levels to find what you are looking for.
          </p>
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl"
          >
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
