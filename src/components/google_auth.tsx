'use client'
import { createClient } from '@/supabase/client'
import { Button } from '@/components/ui/button'

type Props = {
  redirectTo: string
  queryParams?: Record<string, string>
  title?: string
}

export default function GoogleAuth({ redirectTo, title, queryParams }: Props) {
  const onLogin = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          ...queryParams,
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'https://www.googleapis.com/auth/gmail.modify',
      },
    })
    if (error) {
      console.error('Error signing in with Google', error)
    }
  }
  return <Button variant="outline" onClick={onLogin}>{title || 'Sign in with Google'}</Button>
}
