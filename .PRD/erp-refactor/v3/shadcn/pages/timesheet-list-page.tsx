"use client";

// List page for Timesheet
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useTimesheetList } from "../hooks/timesheet.hooks.js";
import { timesheetColumns } from "../columns/timesheet-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TimesheetListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useTimesheetList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Timesheet</h1>
        <Button onClick={() => router.push("/timesheet/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={timesheetColumns}
              data={data}
              onRowClick={(row) => router.push(`/timesheet/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}