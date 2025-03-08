"use client";

import { useState } from "react";
import {
  Mail,
  Inbox,
  Tag,
  Archive,
  Trash,
  Star,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock data for categories
const defaultCategories = [
  { id: "inbox", name: "Inbox", icon: Inbox, count: 24 },
  { id: "important", name: "Important", icon: Star, count: 7 },
  { id: "newsletters", name: "Newsletters", icon: Mail, count: 13 },
  { id: "promotions", name: "Promotions", icon: Tag, count: 21 },
  { id: "archive", name: "Archive", icon: Archive, count: 0 },
  { id: "trash", name: "Trash", icon: Trash, count: 0 },
];

// Mock data for processing jobs
const processingJobs = [
  { id: "job1", subject: "Weekly Newsletter", status: "categorizing" },
  { id: "job2", subject: "Your Amazon Order", status: "categorizing" },
];

export default function DashboardView() {
  const [showProcessingJobs, setShowProcessingJobs] = useState(true);

  const dismissProcessingJobs = () => {
    setShowProcessingJobs(false);
  };

  return (
    <>
      {showProcessingJobs && processingJobs.length > 0 && (
        <>
          {processingJobs.length > 110 ? (
            <Alert className="mb-6 mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Processing emails</AlertTitle>
              <AlertDescription className="flex flex-col gap-2">
                <p>
                  {processingJobs.length} new emails are currently being
                  categorized by AI...
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={dismissProcessingJobs}
                  >
                    Dismiss
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="mb-6 mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>You are up to date!</AlertTitle>
              <AlertDescription className="flex flex-col gap-2">
                <p>All new emails have been categorized.</p>
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </>
  );
}
