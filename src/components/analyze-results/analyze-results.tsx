"use client";
import React, { useEffect, useState } from "react";
import { Message } from "../../types/messages";
import { AnalyzeItem } from "./analyze-item";
import { Separator } from "../ui/separator";
import { getMessagesWithAnalyzeResults } from "../../actions/messages";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import { cn } from "../../lib/utils";

type Props = {
  messages: Message[];
};

export default function AnalyzeResults({ messages }: Props) {
  const [messagesData, setMessagesData] = useState<Message[]>(messages);
  const [loading, setLoading] = useState(false);
  const refresh = async () => {
    try {
      setLoading(true);
      const data = await getMessagesWithAnalyzeResults();
      setMessagesData(data.messages);
    } catch (error) {
      console.error("Failed to refresh analyze results:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Document Analysis</h1>
      <div className="flex items-center justify-between gap-2">
        <p className="text-muted-foreground">
          Review analyzed documents and detected errors
        </p>
        <Button variant="outline" onClick={refresh}>
          <RefreshCcw
            className={cn("h-4 w-4", {
              "animate-spin": loading,
            })}
          />
          Refresh
        </Button>
      </div>
      <Separator className="my-1" />
      <div className={cn("divide-y", {
        "animate-pulse": loading,
        "pointer-events-none": loading,
      })}>
        {messagesData.map((message) => (
          <AnalyzeItem key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
