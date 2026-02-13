"use client";

// List page for Asset Maintenance Task
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAssetMaintenanceTaskList } from "../hooks/asset-maintenance-task.hooks.js";
import { assetMaintenanceTaskColumns } from "../columns/asset-maintenance-task-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssetMaintenanceTaskListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAssetMaintenanceTaskList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Asset Maintenance Task</h1>
        <Button onClick={() => router.push("/asset-maintenance-task/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={assetMaintenanceTaskColumns}
              data={data}
              onRowClick={(row) => router.push(`/asset-maintenance-task/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}