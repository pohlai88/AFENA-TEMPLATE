"use client";

// List page for Job Card Scheduled Time
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useJobCardScheduledTimeList } from "../hooks/job-card-scheduled-time.hooks.js";
import { jobCardScheduledTimeColumns } from "../columns/job-card-scheduled-time-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function JobCardScheduledTimeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useJobCardScheduledTimeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Job Card Scheduled Time</h1>
        <Button onClick={() => router.push("/job-card-scheduled-time/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={jobCardScheduledTimeColumns}
              data={data}
              onRowClick={(row) => router.push(`/job-card-scheduled-time/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}