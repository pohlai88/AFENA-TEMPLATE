"use client";

// List page for Job Card Time Log
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useJobCardTimeLogList } from "../hooks/job-card-time-log.hooks.js";
import { jobCardTimeLogColumns } from "../columns/job-card-time-log-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function JobCardTimeLogListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useJobCardTimeLogList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Job Card Time Log</h1>
        <Button onClick={() => router.push("/job-card-time-log/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={jobCardTimeLogColumns}
              data={data}
              onRowClick={(row) => router.push(`/job-card-time-log/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}