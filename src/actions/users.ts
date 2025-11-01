'use server'

import { Category } from "../types/messages"
import { MailseekUser } from "../types/users"
import { getAuthToken } from "./socket"

export async function getConnectedAccounts() {
  const {
    data: token,
    error,
  } = await getAuthToken()

  if (error) {
    throw new Error('Failed to get auth token')
  }

  const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/connected_accounts`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (resp.status !== 200) {
    throw new Error('Failed to get connected accounts')
  }

  const data: {connected_accounts: MailseekUser[]} = await resp.json()

  return data
}

export async function addCategory(userId: string, category: Pick<Category, "name" | "definition">) {
  const {
    data: token,
    error,
  } = await getAuthToken()

  if (error) {
    throw new Error('Failed to get auth token')
  }

  const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/categories`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      name: category.name,
      definition: category.definition,
    }),
  })

  if (resp.status !== 200) {
    throw new Error('Failed to add category')
  }

  const data: {categories: Category[]} = await resp.json()

  return data
}

export async function getCategories() {
  const {
    data: token,
    error,
  } = await getAuthToken()

  if (error) {
    throw new Error('Failed to get auth token')
  }
  const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/categories`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  const data: {
    categories: Category[]
  } = await resp.json()

  if (resp.status !== 200) {
    throw new Error('Failed to get categories')
  }

  return data
}
