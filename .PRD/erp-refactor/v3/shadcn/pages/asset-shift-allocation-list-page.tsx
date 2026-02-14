"use client";

// List page for Asset Shift Allocation
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAssetShiftAllocationList } from "../hooks/asset-shift-allocation.hooks.js";
import { assetShiftAllocationColumns } from "../columns/asset-shift-allocation-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssetShiftAllocationListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAssetShiftAllocationList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Asset Shift Allocation</h1>
        <Button onClick={() => router.push("/asset-shift-allocation/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={assetShiftAllocationColumns}
              data={data}
              onRowClick={(row) => router.push(`/asset-shift-allocation/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}