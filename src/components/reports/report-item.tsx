"use client"

import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Report } from "../../types/messages"
import { Badge } from "../ui/badge"

interface ReportItemProps {
  report: Report
}

export function ReportItem({ report }: ReportItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={cn("px-3 py-2 transition-colors hover:bg-accent/50 cursor-pointer", isExpanded && "bg-accent/30")}>
      <div className="flex items-center justify-between gap-2" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs text-muted-foreground h-5">
                {typeof report.payload.order !== 'undefined' ? `Msg ${report.message_id || 'n/a'} Order ${report.payload.order}` : null}
              </Badge>
              <h3 className="font-medium truncate text-sm gap-2 flex items-center">
                {report.type}
              </h3>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="truncate max-w-[200px] md:max-w-[300px]">Status: {report.status}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    {report.payload.order ? <p>Order: {report.payload.order}</p> : null}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2 pt-2 border-t text-xs grid grid-cols-1 gap-x-4 gap-y-1">
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <div className="overflow-auto">
              <span className="font-medium mr-1">Summary:</span>
              <pre>{JSON.stringify(report.payload, null, 2)}</pre>
            </div>
          </div>
          {
            report.payload.image_path ? (
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <div className="max-w-full overflow-auto">
                  <img src={`https://gvnnajndglydyiwckdtn.supabase.co/storage/v1/object/public/${report.payload.image_path}`} alt="Report" />
                </div>
              </div>
            ) : null
          }
        </div>
      )}
    </div>
  )
}
