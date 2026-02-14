"use client";

// List page for Maintenance Schedule Detail
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useMaintenanceScheduleDetailList } from "../hooks/maintenance-schedule-detail.hooks.js";
import { maintenanceScheduleDetailColumns } from "../columns/maintenance-schedule-detail-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MaintenanceScheduleDetailListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useMaintenanceScheduleDetailList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Maintenance Schedule Detail</h1>
        <Button onClick={() => router.push("/maintenance-schedule-detail/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={maintenanceScheduleDetailColumns}
              data={data}
              onRowClick={(row) => router.push(`/maintenance-schedule-detail/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}