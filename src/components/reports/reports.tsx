"use client";
import React, { useEffect, useState } from "react";
import { Report } from "../../types/messages";
import { getReports } from "../../actions/messages";
import { ReportItem } from "./report-item";
import { Separator } from "../ui/separator";
type Props = {
  user_id: string;
};

export default function Reports({ user_id }: Props) {
  const [reports, setReports] = useState<Report[]>([]);
  useEffect(() => {
    const fetchReports = async () => {
      const data = await getReports(user_id);
      setReports(data.reports);
    };
    fetchReports();
  }, []);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
      <p className="text-muted-foreground">
        See what's happening with your emails
      </p>
      <Separator className="my-1" />
      <div className="divide-y">
        {reports.map((report) => (
          <ReportItem key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
