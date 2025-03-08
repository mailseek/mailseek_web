'use client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Message, MessageContent } from "../../types/messages"
import { Loader2 } from "lucide-react"


type Props = {
  message: Message
  content: MessageContent | null
  loading: boolean
  isOpen: boolean
  onClose: () => void
}

export default function ShowEmailModal(props: Props) {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose} modal>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{props.message.subject}</DialogTitle>
          <DialogDescription>{"From: " + props.message.from}</DialogDescription>
        </DialogHeader>
        {props.loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : <EmailContent content={props.content} />}
      </DialogContent>
    </Dialog>
  )
}

function EmailContent({ content }: { content: MessageContent | null }) {
  if (!content) return null
  if (content.html) {
    return <iframe style={{ width: '100%', height: '100%', minHeight: '500px' }} srcDoc={content.html} />
  }
  if (content.text) {
    return <div className="whitespace-pre-wrap">{content.text}</div>
  }
  return null
}
