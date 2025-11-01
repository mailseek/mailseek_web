'use server'
import { cookies } from 'next/headers';

export async function getAuthToken() {
  const auth = await cookies()
  const authCookie = auth.get('auth')
  if (!authCookie) {
    return {
      error: 'No auth cookie',
      data: null,
    };
  }
  const session: {
    user_id: string,
    token: string,
    email: string,
  } = JSON.parse(authCookie.value)

  return {
    data: session.token,
    session: session,
    error: null,
  };
}
