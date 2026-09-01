import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Shield,
  Users,
  Building2,
  Briefcase,
  FileText,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/admin/dashboard');
  }

  // Check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  // Platform metrics calculated from DB records
  const { count: totalProfilesCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: totalCompaniesCount } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true });

  const { count: totalJobsCount } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true });

  const { count: totalApplicationsCount } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true });

  // Recent jobs
  const { data: recentJobsData } = await supabase
    .from('jobs')
    .select('*, company:companies(*)')
    .order('created_at', { ascending: false })
    .limit(5);

  const recentJobs = recentJobsData || [];

  const stats = [
    { label: 'Registered Users', value: totalProfilesCount || 0, icon: Users, color: 'text-zinc-900', href: '/admin/users' },
    { label: 'Companies', value: totalCompaniesCount || 0, icon: Building2, color: 'text-blue-600', href: '/admin/companies' },
    { label: 'Total Vacancies', value: totalJobsCount || 0, icon: Briefcase, color: 'text-indigo-600', href: '/admin/jobs' },
    { label: 'Screened Applications', value: totalApplicationsCount || 0, icon: FileText, color: 'text-emerald-600', href: '/admin/applications' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-900 text-white rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Platform Administration
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              System monitoring, data governance, and platform-wide metrics.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card hoverEffect className="p-5">
              <div className="flex items-center justify-between text-zinc-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  {stat.label}
                </span>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
              <div className="text-[11px] text-blue-600 mt-1 flex items-center gap-1 font-semibold">
                Manage records <ArrowRight className="w-3 h-3" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Overview Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Platform Jobs */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              Recent Job Vacancies
            </h2>
            <Link href="/admin/jobs" className="text-xs font-semibold text-blue-600 hover:underline">
              View all →
            </Link>
          </div>

          {recentJobs.length > 0 ? (
            <div className="divide-y divide-zinc-100">
              {recentJobs.map((job) => (
                <div key={job.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900">{job.title}</h3>
                    <p className="text-[11px] text-zinc-500">
                      {job.company?.name || 'Company'} · {job.location}
                    </p>
                  </div>
                  <Badge variant={job.status === 'published' ? 'success' : 'neutral'} size="sm">
                    {job.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 py-6 text-center">No vacancies created yet.</p>
          )}
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              Platform Status
            </h2>
          </div>

          <div className="space-y-3 text-xs text-zinc-600">
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-200/80">
              <span className="font-semibold text-zinc-700">User Accounts</span>
              <span className="text-zinc-500">{totalProfilesCount || 0} registered</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-200/80">
              <span className="font-semibold text-zinc-700">Organisations</span>
              <span className="text-zinc-500">{totalCompaniesCount || 0} companies</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-200/80">
              <span className="font-semibold text-zinc-700">Active Vacancies</span>
              <span className="text-zinc-500">{totalJobsCount || 0} postings</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-200/80">
              <span className="font-semibold text-zinc-700">Applications Received</span>
              <span className="font-semibold text-emerald-600">{totalApplicationsCount || 0} total</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
