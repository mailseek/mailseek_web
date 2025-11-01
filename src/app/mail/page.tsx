import React from 'react'
import { createServerClient } from '@/supabase/server'
import Emails from '../../components/emails';
import { redirect } from 'next/navigation';
import { getAuthToken } from '../../actions/socket';
import { getCategories, getConnectedAccounts } from '../../actions/users';
import { checkAuth } from '../../actions/auth';

export default async function Page() {
  const authCheck = await checkAuth();
  console.log('authCheck', authCheck)
  if (!authCheck.success) {
    redirect('/login');
  }

  const { data: token, session } = await getAuthToken();
  const { categories } = await getCategories();
  const { connected_accounts } = await getConnectedAccounts();

  return (
    <div className="container mx-auto font-[family-name:var(--font-geist-sans)]">
      <Emails socketToken={token!} user={{
        id: session!.user_id,
        email: session!.email,
      }} categories={categories} connectedAccounts={connected_accounts} />
    </div>
  )
}
