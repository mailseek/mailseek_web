import Image from "next/image";
import GoogleAuth from "../components/google_auth";
import { createServerClient } from '@/supabase/server'

export default async function Home() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    console.log('Authorized', user.email)
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)] gap-2 flex flex-col">
          <li>
            Sort your emails efficiently with AI
          </li>
          <li>Unsubscribe from unwanted newsletters</li>
          <li>Get a summary of your emails</li>
          <li>Save time by managing all your inboxes in one place</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {/* <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/auth"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Mail className="w-4 h-4" />
            Start now
          </a> */}
          <GoogleAuth />
        </div>
      </main>
    </div>
  );
}
