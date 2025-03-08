'use server'

import { Message } from "../types/messages"
import { getAuthToken } from "./socket"

export async function getMessages(userId: string, selectedCategoryId: string) {
  const {
    data: token,
    error,
  } = await getAuthToken()
  if (error) {
    throw new Error('Failed to get auth token')
  }
  const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages?user_id=${userId}&category_id=${selectedCategoryId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  const data: {
    messages: Message[]
  } = await resp.json()

  if (resp.status !== 200) {
    throw new Error('Failed to get messages')
  }

  return data
}
