'use server'
import { createServerClient } from '@/supabase/server'
import { generateBackendToken } from '../lib/session';

export async function getAuthToken() {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return {
      error,
      data: null,
    };
  }
  const jwt = await generateBackendToken({
    user_id: data.user.id!,
  });

  return {
    data: jwt,
    error: null,
  };
}
