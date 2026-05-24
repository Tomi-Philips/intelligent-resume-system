import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Standalone Supabase server client — reads request cookies from next/headers,
 * works correctly in all Server Component contexts under Next.js 16.
 */
export async function createSupabaseServerClient() {
  // next/headers cookies() is async — call inside a Server Component only
  const cookieStore = await cookies();

  console.log('[supabaseServer] cookies getAll:', cookieStore.getAll().map(c => c.name).join(', ') || '(none)');

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components can't mutate cookies — safe to ignore.
          }
        },
      },
    },
  );
}
