"use client";

// List page for Asset Repair
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAssetRepairList } from "../hooks/asset-repair.hooks.js";
import { assetRepairColumns } from "../columns/asset-repair-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssetRepairListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAssetRepairList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Asset Repair</h1>
        <Button onClick={() => router.push("/asset-repair/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={assetRepairColumns}
              data={data}
              onRowClick={(row) => router.push(`/asset-repair/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}