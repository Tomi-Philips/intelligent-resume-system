'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function getUser() {
      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        if (error) {
          // If we are in dev/prototype and using placeholder credentials, it might warn/error.
          console.warn('Supabase auth getUser error:', error.message);
        }
        if (mounted) {
          setUser(currentUser);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching user from Supabase:', err);
        if (mounted) {
          setLoading(false);
        }
      }
    }

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
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
    signOut,
  };
}