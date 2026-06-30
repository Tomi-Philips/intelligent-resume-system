'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Settings, User, Bell, Shield, LogOut, Save, CheckCircle, Trash2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';

export default function SettingsPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [notifs, setNotifs] = useState({
    newUploads: true,
    highMatch: true,
    statusChanges: false,
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveError('');
    setSaved(false);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName },
      });
      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setSaveError(e.message ?? 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      const { error } = await supabase.rpc('delete_own_user');
      if (error) throw error;
      await supabase.auth.signOut();
      router.push('/login');
    } catch (e: any) {
      setDeleteError(e.message || 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 mb-4">
          <Settings className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Preferences</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-500" />
            </div>
            <CardTitle className="text-lg font-bold">Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Display Name</label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name..."
              className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
          {saveError && <p className="text-sm text-rose-500">{saveError}</p>}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSaveProfile}
              isLoading={isSaving}
              disabled={isSaving || !displayName.trim()}
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl border-none shadow-sm"
            >
              {!isSaving && (saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />)}
              {isSaving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-500" />
            </div>
            <CardTitle className="text-lg font-bold">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'newUploads', label: 'New resume uploads', desc: 'Get notified when new resumes are uploaded' },
            { key: 'highMatch', label: 'High match candidates', desc: 'Alert when a candidate scores above 80%' },
            { key: 'statusChanges', label: 'Status changes', desc: 'Notify when candidate status is updated' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => setNotifs((n) => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${notifs[key as keyof typeof notifs] ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${notifs[key as keyof typeof notifs] ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-[#111318]/80 backdrop-blur-xl rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-rose-500 to-pink-500" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-rose-500" />
            </div>
            <CardTitle className="text-lg font-bold">Account</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-rose-200 dark:border-rose-500/20 bg-rose-50/50 dark:bg-rose-500/5 gap-4">
            <div>
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">Sign Out</p>
              <p className="text-xs text-rose-500/70 mt-0.5">You will be redirected to the login page</p>
            </div>
            <Button
              onClick={handleSignOut}
              isLoading={isSigningOut}
              disabled={isSigningOut}
              className="gap-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl border-none shadow-sm cursor-pointer"
            >
              {!isSigningOut && <LogOut className="w-4 h-4" />}
              {isSigningOut ? 'Signing out…' : 'Sign Out'}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-rose-200 dark:border-rose-500/20 bg-rose-50/50 dark:bg-rose-500/5 gap-4">
            <div>
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">Delete Account</p>
              <p className="text-xs text-rose-500/70 mt-0.5">Permanently delete your profile and application history</p>
            </div>
            <Button
              onClick={() => setDeleteConfirmOpen(true)}
              className="gap-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl border-none shadow-sm cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Modal */}
      <Modal
        open={deleteConfirmOpen}
        onClose={() => !isDeleting && setDeleteConfirmOpen(false)}
        title="Confirm Account Deletion"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5 text-sm dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Permanent Deletion Warning</p>
              <p className="text-xs text-rose-600 dark:text-rose-400/80 mt-0.5">
                This will delete your credentials, application history, evaluations, and resumes permanently. This action cannot be undone.
              </p>
            </div>
          </div>

          {deleteError && (
            <p className="text-sm text-rose-500 font-semibold">{deleteError}</p>
          )}

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Are you sure you want to permanently delete your account from the HireFlow server?
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
            <Button
              variant="ghost"
              className="rounded-xl"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              isLoading={isDeleting}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl border-none shadow-md cursor-pointer"
            >
              Confirm Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}