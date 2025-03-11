"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Info, Loader2, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Message, MessageContent } from "../../types/messages";
import { Button } from "../ui/button";
import { loadMessage } from "../../actions/messages";
import ShowEmailModal from "./show-email-modal";
import { Checkbox } from "../ui/checkbox";
interface EmailItemProps {
  message: Message;
  selected: boolean;
  onSelect: (messageId: string) => void;
}

export function EmailItem({ message, selected, onSelect }: EmailItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<MessageContent | null>(null);
  const [loading, setLoading] = useState(false);
  const onOpen = async () => {
    try {
      setLoading(true);
      setIsOpen(true);
      const resp = await loadMessage(message.message_id, message.user_id);
      setContent(resp.content);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "px-3 py-2 transition-colors hover:bg-accent/50 cursor-pointer",
        isExpanded && "bg-accent/30"
      )}
    >
      <div className="flex flex-col" onClick={() => setIsExpanded(!isExpanded)}>
        {/* Action buttons row - now at the top */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 w-full">
            <div
              className="flex flex-col justify-between md:justify-start md:flex-row items-center gap-2 hover:bg-muted-foreground/50 p-3 rounded-md shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(message.message_id);
              }}
            >
              <Checkbox
                id={`select-email-${message.message_id}`}
                checked={selected}
                className="border-muted-foreground/50 cursor-pointer"
              />
            </div>
            <div className="w-full justify-between flex items-center gap-2 text-xs text-muted-foreground line-clamp-1 text-ellipsis">
              <div className="flex items-center max-w-64 md:max-w-54 lg:max-w-full">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="truncate">{message.from}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>To: {message.to}</p>
                      <p>From: {message.from}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button
                variant="default"
                size="icon"
                className="md:hidden"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpen();
                }}
              >
                <Mail className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
          {/* Other action buttons remain on the right */}
          <div id="action-buttons" className="flex items-center gap-3 shrink-0">
            <SentAt message={message} className="hidden md:block text-xs" />
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:block shrink-0 whitespace-nowrap"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpen();
              }}
            >
              View Email
            </Button>
            <button
              className="hidden md:flex items-center bg-transparent border-none cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Row with checkbox, status badge, and subject */}
        <div className="flex items-center w-full">
          <div className="hidden md:block shrink-0">
            <StatusBadge message={message} />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden pr-4">
            <h3 className="font-medium text-sm break-words">
              {message.subject}
            </h3>
          </div>
        </div>

        {/* Summary */}
        <div className="flex items-center text-xs text-muted-foreground overflow-hidden w-full">
          <p className="line-clamp-2 overflow-hidden text-ellipsis w-full">
            <span className="break-words">{message.summary}</span>
          </p>
        </div>

        {/* Mobile status badge and date */}
        <div className="w-full flex justify-between items-center md:hidden gap-2 mt-1">
          <StatusBadge message={message} />
          <div className="flex items-center gap-2 shrink-0">
            <SentAt message={message} className="flex items-center" />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2 pt-2 border-t text-xs grid grid-cols-1 gap-x-4 gap-y-1">
          <div className="col-span-2 flex items-start gap-1">
            <span className="font-medium">To:</span>
            <span className="text-muted-foreground">{message.to}</span>
          </div>
          <div className="col-span-2 flex items-start gap-1">
            <span className="font-medium">From:</span>
            <span className="text-muted-foreground">{message.from}</span>
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="font-medium">Summary:</span>
            <span className="text-muted-foreground">{message.summary}</span>
          </div>
          <div className="col-span-2 flex items-start gap-1">
            <span className="font-medium">Model:</span>
            <span className="text-muted-foreground">{message.model}</span>
          </div>
          <div className="col-span-2 flex items-start gap-1">
            <span className="font-medium">Temperature:</span>
            <span className="text-muted-foreground">{message.temperature}</span>
          </div>
          <div className="col-span-2 flex items-start gap-1"></div>
          <div className="col-span-2 flex flex-col items-start gap-1">
            <span className="font-medium">Why this category:</span>
            <span className="text-muted-foreground">{message.reason}</span>
          </div>
        </div>
      )}
      <ShowEmailModal
        message={message}
        content={content}
        loading={loading}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}

function StatusBadge({ message }: { message: Message }) {
  switch (message.status) {
    case "deleted":
      return (
        <Badge variant="outline" className="text-xs text-red-500 h-5">
          Deleted
        </Badge>
      );
    case "unsubscribing":
      return (
        <Badge variant="outline" className="text-xs text-red-500 h-5">
          <Loader2 className="animate-spin" /> Unsubscribing
        </Badge>
      );
    case "unsubscribed":
      return (
        <Badge variant="outline" className="text-xs text-red-500 h-5">
          Unsubscribed
        </Badge>
      );
    case "unsubscribe_link_not_found":
      return (
        <Badge variant="outline" className="text-xs text-red-500 h-5">
          Unsubscribe Link Not Found
        </Badge>
      );
    default:
      return <div />;
  }
}

function SentAt({
  message,
  className,
}: {
  message: Message;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-xs text-muted-foreground whitespace-nowrap",
        className
      )}
    >
      {message.sent_at
        ? new Date(message.sent_at + "Z").toLocaleString(
            navigator.language || navigator.languages[0] || "en-US",
            {
              dateStyle: "short",
              timeStyle: "short",
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            }
          )
        : "n/a"}
    </span>
  );
}
