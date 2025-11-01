import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  console.log('impersonate route')
  const email = process.env.DEMO_IMPERSONATE_EMAIL || 'x@example.com'

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  if (!backendUrl) {
    return NextResponse.json({ error: 'Backend URL is not configured' }, { status: 500 })
  }
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) {
    return NextResponse.json({ error: 'Authorization header is not configured' }, { status: 401 })
  }

  const impersonateResponse = await fetch(`${backendUrl}/api/admin/impersonate`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  if (!impersonateResponse.ok) {
    return NextResponse.json({ error: 'Failed to get impersonate email' }, { status: 500 })
  }

  const json: { user_id: string, token: string, email: string } = await impersonateResponse.json()
  const session = { user_id: json.user_id, token: json.token, email: json.email }
  console.log('session', session)

  const cookieStore = await cookies()
  cookieStore.set('auth', JSON.stringify(session), {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    sameSite: 'lax',
    path: '/',
  })

  return NextResponse.json({ email })
}
