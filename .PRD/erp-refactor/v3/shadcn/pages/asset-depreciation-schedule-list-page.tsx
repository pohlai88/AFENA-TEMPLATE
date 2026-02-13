"use client";

// List page for Asset Depreciation Schedule
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAssetDepreciationScheduleList } from "../hooks/asset-depreciation-schedule.hooks.js";
import { assetDepreciationScheduleColumns } from "../columns/asset-depreciation-schedule-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssetDepreciationScheduleListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAssetDepreciationScheduleList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Asset Depreciation Schedule</h1>
        <Button onClick={() => router.push("/asset-depreciation-schedule/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={assetDepreciationScheduleColumns}
              data={data}
              onRowClick={(row) => router.push(`/asset-depreciation-schedule/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}