'use server'

import { CategorySettings } from "../types/messages"
import { getAuthToken } from "./socket"

export async function saveCategorySettings(categoryId: string, settings: CategorySettings, userId: string) {
  try {
    const { data: token } = await getAuthToken()
    if (!token) {
      throw new Error('No auth token found')
    }
    const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}/categories/${categoryId}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        settings,
      }),
    });
    if (!resp.ok) {
      throw new Error("Failed to save category settings");
    }
    const data: { settings: CategorySettings } = await resp.json()
    return data
  } catch (error) {
    console.error(error);
    return {
      settings: null,
    };
  }
}
export async function getCategorySettings(categoryId: string, userId: string) {
  try {
    const { data: token } = await getAuthToken()
    if (!token) {
      throw new Error('No auth token found')
    }
    const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}/categories/${categoryId}/settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    if (!resp.ok) {
      throw new Error('Failed to fetch category settings')
    }
    const data: { settings: CategorySettings } = await resp.json()
    return data
  } catch (error) {
    console.error(error)
    return {
      settings: null,
    };
  }
}
