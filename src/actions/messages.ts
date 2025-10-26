'use server'

import { Message, MessageContent, Report } from "../types/messages"
import { getAuthToken } from "./socket"

export async function deleteMessages(message_ids: string[], user_id: string) {
  const {
    data: token,
    error,
  } = await getAuthToken()
  if (error) {
    throw new Error('Failed to get auth token')
  }
  const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/delete`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message_ids, user_id }),
  })
  console.log(resp, process.env.NEXT_PUBLIC_BACKEND_URL)
  if (resp.status !== 200) {
    throw new Error('Failed to delete messages')
  }
  const data: {messages: Message[]} = await resp.json()

  return data
}

export async function unsubscribeFromEmails(message_ids: string[], user_id: string) {
  const {
    data: token,
    error,
  } = await getAuthToken()

  if (error) {
    throw new Error('Failed to get auth token')
  }
  const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/unsubscribe`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message_ids, user_id }),
  })

  if (resp.status !== 200) {
    throw new Error('Failed to unsubscribe from emails')
  }
  const data: {messages: Message[]} = await resp.json()
  return data
}

export async function analyzeMessage(message_id: string) {
  const {
    data: token,
    error,
  } = await getAuthToken()

  if (error) {
    throw new Error('Failed to get auth token')
  }
  const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/analyze_documents`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message_id, user_id: "123" }),
  })

  if (resp.status !== 200) {
    throw new Error('Failed to analyze message')
  }
  const data: {message: string} = await resp.json()
  return data
}

export async function getReports(user_id: string) {
  const {
    data: token,
    error,
  } = await getAuthToken()
  if (error) {
    throw new Error('Failed to get auth token')
  }
  const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports?user_id=${user_id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  const data: {
    reports: Report[]
  } = await resp.json()
  return data
}

export async function loadMessage(message_id: string, user_id: string) {
  const {
    data: token,
    error,
  } = await getAuthToken()

  if (error) {
    throw new Error('Failed to get auth token')
  }

  const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/${message_id}?user_id=${user_id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (resp.status !== 200) {
    throw new Error('Failed to get message')
  }

  const data: {
    content: MessageContent
  } = await resp.json()

  return data
}

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
