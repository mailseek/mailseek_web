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
      <div
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 w-full">
          <div
            className="flex flex-col justify-between md:justify-start md:flex-row items-center gap-2 hover:bg-muted-foreground/50 p-3 rounded-md"
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
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <div className="flex-1">
              <div className="w-full flex justify-between items-center md:hidden gap-2">
                <StatusBadge message={message} />
                <div className="flex items-center gap-2">
                  <SentAt message={message} className="flex items-center" />
                  <Button
                    variant="default"
                    size="icon"
                    className="md:hidden mt-4"
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
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate text-sm gap-2 flex flex-col md:flex-row items-start md:items-center">
                  <div className="hidden md:block">
                    <StatusBadge message={message} />
                  </div>
                  <span>{message.subject}</span>
                </h3>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="truncate max-w-[200px] md:max-w-[300px]">
                        From: {message.from}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{message.from}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <p className="line-clamp-2 overflow-hidden text-ellipsis">
                  <span>{message.summary}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 hidden md:block">
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                  <p>
                    Model: <span className="font-bold">{message.model}</span>
                  </p>
                  <p>Temperature: {message.temperature}</p>
                  <p>Why this category: {message.reason}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <SentAt message={message} className="hidden md:block" />
            {isExpanded ? (
              <ChevronUp className="hidden md:block h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="hidden md:block h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:block"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpen();
            }}
          >
            View Email
          </Button>
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
          <div className="flex items-start gap-1">
            <span className="font-medium">Summary:</span>
            <span className="text-muted-foreground">{message.summary}</span>
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
