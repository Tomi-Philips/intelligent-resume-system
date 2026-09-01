import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Profile } from '@/types/database';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft } from 'lucide-react';

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (currentProfile?.role !== 'admin') {
    redirect('/dashboard');
  }

  const { data: usersData } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  const users = (usersData || []) as Profile[];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to admin dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Platform Users ({users.length})
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Registered accounts across Job Seekers, Companies, and Administrators.
        </p>
      </div>

      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Name / Identifier</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4 text-right">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-50/70">
                <td className="py-3.5 px-4 font-bold text-zinc-900">
                  {u.full_name || 'Anonymous User'}
                </td>
                <td className="py-3.5 px-4 text-zinc-600">{u.email}</td>
                <td className="py-3.5 px-4">
                  <Badge
                    variant={
                      u.role === 'admin'
                        ? 'accent'
                        : u.role === 'company'
                        ? 'warning'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    {u.role.toUpperCase()}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 text-zinc-500">{u.location || '—'}</td>
                <td className="py-3.5 px-4 text-right text-zinc-400">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
