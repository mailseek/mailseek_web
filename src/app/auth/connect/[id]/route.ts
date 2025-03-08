import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createServerClient } from '@/supabase/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'
  if (code) {
    const { id: ownerUserId } = await params
    const supabase = await createServerClient()
    const { data: { session: originalSession } } = await supabase.auth.getSession()
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.redirect(`${origin}/login`)
    }
    if (user.id !== ownerUserId) {
      return NextResponse.redirect(`${origin}/login`)
    }
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    const google_token = data.session?.provider_token
    const refresh_token = data.session?.provider_refresh_token
    const expires_at = data.session?.expires_at
    if (!data.user?.id) {
      console.log('No user id found in data', data)
      return NextResponse.redirect(`${origin}/login`)
    }
    if (!error) {
      await writeConnectedAccount(originalSession!.access_token, user.id, data.user.id!, {
        access_token: google_token!,
        refresh_token: refresh_token!,
        email: data.user!.email!,
        user_id: data.user!.id!,
        expires_at: expires_at!,
        data: data
      })

      await supabase.auth.setSession(originalSession!)
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

async function writeConnectedAccount(accessToken: string, ownerUserId: string, connectedUserId: string, connectedUserData: {
  access_token: string,
  refresh_token: string,
  email: string,
  user_id: string,
  expires_at: number,
  data: any
}) {
  if (ownerUserId === connectedUserId) {
    console.log('Logging in with the same user, shouldnt do anything')
  } else {
    const {
      access_token,
      refresh_token,
      email,
      user_id,
      expires_at,
    } = connectedUserData
    const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/google/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        from: ownerUserId,
        to: {
          email,
          user_id,
          access_token,
          refresh_token,
          expires_at,
        }
      }),
    })
    if (resp.status !== 200) {
      console.log('Error connecting accounts', resp)
      throw new Error('Error connecting accounts')
    }
  }
}
