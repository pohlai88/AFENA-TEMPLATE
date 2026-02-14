"use client";

// List page for Incoming Call Handling Schedule
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useIncomingCallHandlingScheduleList } from "../hooks/incoming-call-handling-schedule.hooks.js";
import { incomingCallHandlingScheduleColumns } from "../columns/incoming-call-handling-schedule-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function IncomingCallHandlingScheduleListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useIncomingCallHandlingScheduleList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Incoming Call Handling Schedule</h1>
        <Button onClick={() => router.push("/incoming-call-handling-schedule/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={incomingCallHandlingScheduleColumns}
              data={data}
              onRowClick={(row) => router.push(`/incoming-call-handling-schedule/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}