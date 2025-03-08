"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Message } from "../../types/messages"
interface EmailItemProps {
  message: Message
}

export function EmailItem({ message }: EmailItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={cn("px-3 py-2 transition-colors hover:bg-accent/50 cursor-pointer", isExpanded && "bg-accent/30")}>
      <div className="flex items-center justify-between" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate text-sm gap-2 flex items-center">
                {message.need_action ? <Badge variant="outline" className="text-xs text-yellow-500 h-5">Action Needed</Badge> : null}
                {message.subject}
              </h3>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="truncate max-w-[200px] md:max-w-[300px]">From: {message.from}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{message.from}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <p className="line-clamp-1 overflow-hidden text-ellipsis">
                <span className="font-medium mr-1">Summary:</span>
                <span>{message.summary}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Model: <span className="font-bold">{message.model}</span></p>
                <p>Temperature: {message.temperature}</p>
                <p>Why this category: {message.reason}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date().toLocaleDateString()}</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2 pt-2 border-t text-xs grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="flex items-start gap-1">
            <span className="font-medium">Summary:</span>
            <span className="text-muted-foreground">{message.summary}</span>
          </div>
          <div className="col-span-2 flex items-start gap-1">
            <span className="font-medium">To:</span>
            <span className="text-muted-foreground">{message.to}</span>
          </div>
        </div>
      )}
    </div>
  )
}
