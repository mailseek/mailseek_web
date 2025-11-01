'use server'

import { BACKEND_URL } from '../config'
import { getAuthToken } from './socket'

export async function checkAuth() {
  const {
    data: token,
    session,
    error,
  } = await getAuthToken()

  if (error || !token) {
    return {
      success: false,
      error: 'Failed to get auth token',
    }
  }

  try {
    const resp = await fetch(`${BACKEND_URL}/api/users/auth/check`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (resp.status !== 200) {
      return {
        success: false,
        error: 'Auth check failed',
      }
    }

    return {
      success: true,
      session: session,
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to check auth',
      session: null,
    }
  }
}
