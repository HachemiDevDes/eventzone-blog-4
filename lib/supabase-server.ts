import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side Supabase client (for use in Server Components and API routes)
export function createServerSupabaseClient() {
  const cookieStore = cookies();
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
           // Ignored from sever component
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch {
           // Ignored from server component 
        }
      },
    },
  });
}

import { createClient } from '@supabase/supabase-js';

// Static Supabase client (for use in public Server Components and SSG without cookies)
export function createStaticSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}
