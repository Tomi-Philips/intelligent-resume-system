import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Company } from '@/types/database';
import { ArrowLeft, Globe, Building2 } from 'lucide-react';

export default async function AdminCompaniesPage() {
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

  const { data: companiesData } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false });

  const companies = (companiesData || []) as Company[];

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
          Registered Companies ({companies.length})
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Organizations registered to publish job vacancies and screen candidates.
        </p>
      </div>

      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Company Name</th>
              <th className="py-3 px-4">Industry</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Website</th>
              <th className="py-3 px-4 text-right">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {companies.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-50/70">
                <td className="py-3.5 px-4 font-bold text-zinc-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-zinc-400" />
                  {c.name}
                </td>
                <td className="py-3.5 px-4 text-zinc-600">{c.industry || '—'}</td>
                <td className="py-3.5 px-4 text-zinc-600">{c.email || '—'}</td>
                <td className="py-3.5 px-4 text-zinc-500">{c.location || '—'}</td>
                <td className="py-3.5 px-4 text-blue-600">
                  {c.website ? (
                    <a href={c.website} target="_blank" rel="noreferrer" className="hover:underline inline-flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Visit
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="py-3.5 px-4 text-right text-zinc-400">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
