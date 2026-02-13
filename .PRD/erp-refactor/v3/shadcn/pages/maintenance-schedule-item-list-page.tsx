"use client";

// List page for Maintenance Schedule Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useMaintenanceScheduleItemList } from "../hooks/maintenance-schedule-item.hooks.js";
import { maintenanceScheduleItemColumns } from "../columns/maintenance-schedule-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MaintenanceScheduleItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useMaintenanceScheduleItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Maintenance Schedule Item</h1>
        <Button onClick={() => router.push("/maintenance-schedule-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={maintenanceScheduleItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/maintenance-schedule-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}