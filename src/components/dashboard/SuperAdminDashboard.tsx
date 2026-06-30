'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Trash2, 
  Search, 
  Shield, 
  ShieldAlert,
  AlertCircle, 
  CheckCircle2, 
  Sliders, 
  RefreshCw, 
  Crown,
  Briefcase
} from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'super_admin' | 'recruiter' | 'user';
  status: 'active' | 'suspended';
  created_at: string;
}

export function SuperAdminDashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Stats
  const [stats, setStats] = useState({
    totalRecruiters: 0,
    totalJobSeekers: 0,
    activeJobs: 0,
    totalApplications: 0,
  });

  // Action states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Role Edit state
  const [roleEditOpen, setRoleEditOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'super_admin' | 'recruiter' | 'user'>('user');

  const fetchProfilesAndStats = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      
      // 1. Fetch profiles
      const { data: profilesData, error: profilesErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesErr) throw profilesErr;
      const list = (profilesData || []) as Profile[];
      setProfiles(list);

      // 2. Fetch stats
      const recruitersCount = list.filter((p) => p.role === 'recruiter').length;
      const jobSeekersCount = list.filter((p) => p.role === 'user').length;

      const [jobsRes, candidatesRes] = await Promise.all([
        supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('candidates').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        totalRecruiters: recruitersCount,
        totalJobSeekers: jobSeekersCount,
        activeJobs: jobsRes.count || 0,
        totalApplications: candidatesRes.count || 0,
      });

    } catch (err: any) {
      console.error('Error loading admin dashboard:', err);
      setErrorMsg(err.message || 'Error loading dashboard profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfilesAndStats();
  }, []);

  const handleToggleStatus = async (profile: Profile) => {
    setActionLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    const newStatus = profile.status === 'active' ? 'suspended' : 'active';
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', profile.id);

      if (error) throw error;
      setSuccessMsg(`User status updated to ${newStatus}.`);
      fetchProfilesAndStats();
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to update user status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenRoleEdit = (profile: Profile) => {
    setSelectedProfile(profile);
    setSelectedRole(profile.role);
    setRoleEditOpen(true);
  };

  const handleRoleChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;
    setActionLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 1. Update profiles table
      const { error: profileErr } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('id', selectedProfile.id);

      if (profileErr) throw profileErr;

      // 2. Update auth metadata so it stays synced
      // Note: Because client SDK cannot update other users' auth metadata directly, 
      // the Super Admin's DB updates are synced when the user logs in or profile changes.
      
      setSuccessMsg(`Successfully changed role for ${selectedProfile.full_name} to ${selectedRole}.`);
      setRoleEditOpen(false);
      fetchProfilesAndStats();
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to update user role.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDeleteConfirm = (profile: Profile) => {
    setSelectedProfile(profile);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteUserSubmit = async () => {
    if (!selectedProfile) return;
    setActionLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Call the SECURITY DEFINER postgres function to delete from auth.users
      const { error } = await supabase.rpc('delete_user_by_admin', {
        target_user_id: selectedProfile.id,
      });

      if (error) throw error;

      setSuccessMsg(`Successfully deleted account for ${selectedProfile.full_name}.`);
      setDeleteConfirmOpen(false);
      fetchProfilesAndStats();
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to delete user.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter profiles based on search query, role filter, status filter
  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch = 
      p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.includes(searchQuery);

    const matchesRole = roleFilter === 'all' || p.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 mb-4">
            <Shield className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-xs font-medium text-rose-600 dark:text-rose-400">Security & Administration</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
            System Administration
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage all active user profiles, roles, and security locks</p>
        </div>
        <Button 
          onClick={fetchProfilesAndStats}
          variant="outline"
          className="h-11 border-slate-200 dark:border-slate-800 rounded-xl gap-2 hover:bg-slate-100 dark:hover:bg-slate-900"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </Button>
      </div>

      {/* Message Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5 text-sm dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-start gap-2.5 text-sm dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0 animate-bounce" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Recruiters Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">{stats.totalRecruiters}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Job Seekers Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">{stats.totalJobSeekers}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Active Open Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-emerald-500">{stats.activeJobs}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-pink-500 to-rose-500" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Total CVs Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">{stats.totalApplications}</p>
          </CardContent>
        </Card>
      </div>

      {/* User Management Directory */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-slate-700 to-slate-900" />
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold">Profiles & Credentials Registry</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Manage details, roles, lock accounts, or perform system deletions</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, id..."
                  className="pl-10 h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Roles</option>
                <option value="super_admin">Super Admins</option>
                <option value="recruiter">Recruiters</option>
                <option value="user">Job Seekers</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table<Profile>
            data={filteredProfiles}
            keyExtractor={(profile) => profile.id}
            emptyMessage="No profiles match the filter criteria."
            columns={[
              {
                key: 'full_name',
                header: 'Full Name',
                render: (p) => (
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">{p.full_name}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{p.id}</span>
                  </div>
                ),
              },
              {
                key: 'email',
                header: 'Email',
                render: (p) => <span className="text-slate-600 dark:text-slate-300">{p.email}</span>,
              },
              {
                key: 'role',
                header: 'Role',
                render: (p) => {
                  const badges = {
                    super_admin: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
                    recruiter: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                    user: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
                  };
                  return (
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full border ${badges[p.role]}`}>
                      {p.role.replace('_', ' ').toUpperCase()}
                    </span>
                  );
                },
              },
              {
                key: 'status',
                header: 'Status',
                render: (p) => {
                  const active = p.status === 'active';
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${active ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {p.status.toUpperCase()}
                    </span>
                  );
                },
              },
              {
                key: 'actions',
                header: '',
                className: 'text-right pr-6',
                render: (p) => (
                  <div className="flex items-center justify-end gap-2">
                    {/* Role Change */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenRoleEdit(p)}
                      className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-xl"
                      title="Modify user role"
                    >
                      <Crown className="w-4 h-4" />
                    </Button>

                    {/* Suspension Toggle */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(p)}
                      className={`rounded-xl ${p.status === 'active' ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10' : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'}`}
                      title={p.status === 'active' ? 'Suspend User' : 'Unsuspend User'}
                    >
                      {p.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </Button>

                    {/* Deletion */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDeleteConfirm(p)}
                      className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl"
                      title="Permanently Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Role Change Modal */}
      <Modal
        open={roleEditOpen}
        onClose={() => setRoleEditOpen(false)}
        title={selectedProfile ? `Change Role: ${selectedProfile.full_name}` : 'Change User Role'}
        maxWidth="sm"
      >
        {selectedProfile && (
          <form onSubmit={handleRoleChangeSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="user">Job Seeker (Candidate)</option>
                <option value="recruiter">Recruiter</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl"
                onClick={() => setRoleEditOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={actionLoading}
                disabled={actionLoading}
                className="bg-blue-600 text-white rounded-xl border-none"
              >
                Apply Role Change
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Confirm User Deletion"
        maxWidth="md"
      >
        {selectedProfile && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5 text-sm dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold">Permanent Deletion warning</p>
                <p className="text-xs text-rose-600 dark:text-rose-400/80 mt-0.5">
                  Deleting {selectedProfile.full_name} ({selectedProfile.email}) will remove their credential logs, job posts, uploaded resumes, and candidate pipelines completely. This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to permanently delete this user from the HireFlow server?
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="ghost"
                className="rounded-xl"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteUserSubmit}
                isLoading={actionLoading}
                disabled={actionLoading}
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl border-none shadow-md"
              >
                Delete Account
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
