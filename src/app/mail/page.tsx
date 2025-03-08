import React from 'react'
import { createServerClient } from '@/supabase/server'
import Emails from '../../components/emails';
import { redirect } from 'next/navigation';
import { getAuthToken } from '../../actions/socket';

export default async function Page() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: token } = await getAuthToken();

  return (
    <div className="container mx-auto font-[family-name:var(--font-geist-sans)]">
      <div className="text-muted-foreground text-sm">
        <p>
          You are logged in as {user.email}
        </p>
      </div>
      <Emails socketToken={token!} user={user} />
    </div>
  )
}
