import { createServerClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import Reports from "../../components/reports/reports";
import Link from "next/link";
import { Separator } from "../../components/ui/separator";
export default async function ReportsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="container mt-10 mx-auto font-[family-name:var(--font-geist-sans)]">
      <div className="text-sm text-muted-foreground">
        <Link href="/mail">Back to Mail</Link>
        <Separator className="my-1" />
        <p>All screenshots and other reports are listed below</p>
      </div>
      <Reports user_id={user.id} />
    </div>
  )
}
