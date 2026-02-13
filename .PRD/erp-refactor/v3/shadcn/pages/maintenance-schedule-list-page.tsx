"use client";

// List page for Maintenance Schedule
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useMaintenanceScheduleList } from "../hooks/maintenance-schedule.hooks.js";
import { maintenanceScheduleColumns } from "../columns/maintenance-schedule-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MaintenanceScheduleListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useMaintenanceScheduleList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Maintenance Schedule</h1>
        <Button onClick={() => router.push("/maintenance-schedule/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={maintenanceScheduleColumns}
              data={data}
              onRowClick={(row) => router.push(`/maintenance-schedule/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}