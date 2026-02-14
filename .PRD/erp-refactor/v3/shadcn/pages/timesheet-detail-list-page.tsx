"use client";

// List page for Timesheet Detail
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useTimesheetDetailList } from "../hooks/timesheet-detail.hooks.js";
import { timesheetDetailColumns } from "../columns/timesheet-detail-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TimesheetDetailListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useTimesheetDetailList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Timesheet Detail</h1>
        <Button onClick={() => router.push("/timesheet-detail/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={timesheetDetailColumns}
              data={data}
              onRowClick={(row) => router.push(`/timesheet-detail/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}