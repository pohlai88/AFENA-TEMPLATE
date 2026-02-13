"use client";

// List page for Asset Maintenance Log
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAssetMaintenanceLogList } from "../hooks/asset-maintenance-log.hooks.js";
import { assetMaintenanceLogColumns } from "../columns/asset-maintenance-log-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssetMaintenanceLogListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAssetMaintenanceLogList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Asset Maintenance Log</h1>
        <Button onClick={() => router.push("/asset-maintenance-log/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={assetMaintenanceLogColumns}
              data={data}
              onRowClick={(row) => router.push(`/asset-maintenance-log/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}