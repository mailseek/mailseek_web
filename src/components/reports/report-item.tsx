"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Report } from "../../types/messages"
import { Badge } from "../ui/badge"
import { ChevronDown } from "lucide-react"
import { ChevronUp } from "lucide-react"

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
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
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
