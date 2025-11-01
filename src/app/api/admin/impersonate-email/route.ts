import { NextResponse } from 'next/server'

export async function GET() {
  const email = process.env.DEMO_IMPERSONATE_EMAIL || 'x@example.com'
  return NextResponse.json({ email })
}
