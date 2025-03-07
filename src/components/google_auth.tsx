'use client'
import { createClient } from '@/supabase/client'
import { Button } from '@/components/ui/button'

export default function GoogleAuth() {
  const onLogin = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'https://www.googleapis.com/auth/gmail.modify',
      },
    })
    if (error) {
      console.error('Error signing in with Google', error)
    } else {
      console.log('Google auth', data)
    }
  }
  return <Button variant="outline" onClick={onLogin}>Sign in with Google</Button>
}
