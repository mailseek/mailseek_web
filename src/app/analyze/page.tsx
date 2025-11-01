import { redirect } from "next/navigation";
import AnalyzeResults from "../../components/analyze-results/analyze-results";
import Link from "next/link";
import { Separator } from "../../components/ui/separator";
import { getMessagesWithAnalyzeResults } from "../../actions/messages";
import { checkAuth } from "../../actions/auth";

export default async function AnalyzePage() {
  const authCheck = await checkAuth();
  if (!authCheck.success) {
    redirect('/login');
  }

  const data = await getMessagesWithAnalyzeResults();

  return (
    <div className="container mt-10 mx-auto font-[family-name:var(--font-geist-sans)] mb-12">
      <div className="text-sm text-muted-foreground mb-4">
        <Link href="/mail">Back to Mail</Link>
        <Separator className="my-1" />
      </div>
      <AnalyzeResults messages={data.messages} />
    </div>
  )
}
