import { createServerSupabaseClient } from './supabase-server';

export async function getSession() {
  const supabase = createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}
