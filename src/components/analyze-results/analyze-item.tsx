"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Message } from "../../types/messages"
import { Badge } from "../ui/badge"
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"

interface AnalyzeItemProps {
  message: Message
}

export function AnalyzeItem({ message }: AnalyzeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!message.analyze_result) {
    return null
  }

  const { result } = message.analyze_result
  const statusColors = {
    no_errors: "text-green-600",
    minor_errors: "text-yellow-600",
    critical_errors: "text-red-600",
  }

  const StatusIcon = {
    no_errors: CheckCircle,
    minor_errors: AlertTriangle,
    critical_errors: AlertCircle,
  }[result.status]

  const statusText = {
    no_errors: "No Errors",
    minor_errors: "Minor Errors",
    critical_errors: "Critical Errors",
  }[result.status]

  // Group errors by document_type
  const errorsByDocType = result.errors.reduce((acc, error) => {
    if (!acc[error.document_type]) {
      acc[error.document_type] = []
    }
    acc[error.document_type].push(error)
    return acc
  }, {} as Record<string, typeof result.errors>)

  return (
    <div className={cn("rounded-md px-3 py-2 transition-colors hover:bg-accent/50 cursor-pointer", isExpanded && "bg-accent/30")}>
      <div className="flex items-center justify-between gap-2" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <StatusIcon className={cn("h-4 w-4", statusColors[result.status])} />
              <Badge variant="outline" className={cn("text-xs h-5", statusColors[result.status])}>
                {statusText}
              </Badge>
              <h3 className="font-medium truncate text-sm">
                {message.subject}
              </h3>
            </div>
            <div className="flex items-center justify-between gap-2 mt-1">
              <p className="text-xs text-muted-foreground truncate">
                From: {message.from}
              </p>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
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
        <div className="mt-2 pt-2 border-t text-xs grid grid-cols-1 gap-y-2">
          <div className="text-sm">
            <span className="font-medium text-muted-foreground">Summary:</span>
            <p className="mt-1 text-foreground">{result.summary}</p>
          </div>

          {result.errors.length > 0 && (
            <div className="text-sm">
              <span className="font-medium text-muted-foreground">Errors ({result.errors.length}):</span>
              <div className="mt-2 space-y-3">
                {Object.entries(errorsByDocType).map(([docType, errors]) => (
                  <div key={docType} className="border rounded-md p-3 bg-accent/20">
                    <div className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <span>{docType}</span>
                      <Badge variant="secondary" className="text-xs">
                        {errors.length} {errors.length === 1 ? 'error' : 'errors'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {errors.map((error, idx) => (
                        <div key={idx} className="border rounded-md p-2 bg-background">
                          <div className="flex items-start gap-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs h-5",
                                error.severity === "critical" && "text-red-600 border-red-600",
                                error.severity === "major" && "text-orange-600 border-orange-600",
                                error.severity === "minor" && "text-yellow-600 border-yellow-600"
                              )}
                            >
                              {error.severity}
                            </Badge>
                            <div className="flex-1">
                              <p className="text-muted-foreground text-xs">
                                <span className="font-medium">Field:</span> {error.field}
                              </p>
                              <p className="text-foreground mt-1">{error.error}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-4 text-xs text-muted-foreground mt-2">
            <div>
              <span className="font-medium">Model:</span> {message.analyze_result.model}
            </div>
            <div>
              <span className="font-medium">Temperature:</span> {message.analyze_result.temperature}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
