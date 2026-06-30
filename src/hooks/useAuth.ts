'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>('user');
  const [status, setStatus] = useState<string>('active');
  const router = useRouter();

  // Separate effect to load profile when user changes
  useEffect(() => {
    let mounted = true;

    if (!user) {
      setRole('user');
      setStatus('active');
      return;
    }

    async function fetchProfile(userId: string, retryOnce = true) {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, status')
          .eq('id', userId)
          .single();

        if (!mounted) return;

        if (!profileError && profile) {
          setRole(profile.role ?? 'user');
          setStatus(profile.status ?? 'active');
          return;
        }

        // If the profile row doesn't exist yet (trigger propagation lag), retry once after 1s
        if (retryOnce) {
          await new Promise((res) => setTimeout(res, 1000));
          if (mounted) {
            await fetchProfile(userId, false);
          }
        } else {
          console.warn('Could not fetch profile from DB:', profileError?.message);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    }

    fetchProfile(user.id);

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  useEffect(() => {
    let mounted = true;

    async function getUserAndProfile() {
      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        if (error) {
          console.warn('Supabase auth getUser error:', error.message);
        }
        if (currentUser && mounted) {
          setUser(currentUser);
        }
        if (mounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching user from Supabase:', err);
        if (mounted) {
          setLoading(false);
        }
      }
    }

    getUserAndProfile();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const email = user?.email || 'recruiter@hireflow.com';
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Recruiter User';

  return {
    user,
    loading,
    name,
    email,
    role,
    status,
    signOut,
  };
}