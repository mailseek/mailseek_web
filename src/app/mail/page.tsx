import React from 'react'
import { createServerClient } from '@/supabase/server'
import Emails from '../../components/emails';
import { redirect } from 'next/navigation';
import { getAuthToken } from '../../actions/socket';
import { getCategories, getConnectedAccounts } from '../../actions/users';

export default async function Page() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: token } = await getAuthToken();
  const { categories } = await getCategories(user.id);
  const { connected_accounts } = await getConnectedAccounts(user.id);

  return (
    <div className="container mx-auto font-[family-name:var(--font-geist-sans)]">
      <Emails socketToken={token!} user={{
        id: user.id,
        email: user.email!,
      }} categories={categories} connectedAccounts={connected_accounts} />
    </div>
  )
}
