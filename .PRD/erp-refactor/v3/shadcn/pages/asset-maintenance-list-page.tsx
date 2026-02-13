"use client";

// List page for Asset Maintenance
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAssetMaintenanceList } from "../hooks/asset-maintenance.hooks.js";
import { assetMaintenanceColumns } from "../columns/asset-maintenance-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssetMaintenanceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAssetMaintenanceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Asset Maintenance</h1>
        <Button onClick={() => router.push("/asset-maintenance/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={assetMaintenanceColumns}
              data={data}
              onRowClick={(row) => router.push(`/asset-maintenance/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}