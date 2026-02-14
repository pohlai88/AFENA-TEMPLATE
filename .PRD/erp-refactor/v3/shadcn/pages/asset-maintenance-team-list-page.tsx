"use client";

// List page for Asset Maintenance Team
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAssetMaintenanceTeamList } from "../hooks/asset-maintenance-team.hooks.js";
import { assetMaintenanceTeamColumns } from "../columns/asset-maintenance-team-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssetMaintenanceTeamListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAssetMaintenanceTeamList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Asset Maintenance Team</h1>
        <Button onClick={() => router.push("/asset-maintenance-team/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={assetMaintenanceTeamColumns}
              data={data}
              onRowClick={(row) => router.push(`/asset-maintenance-team/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}