"use client";

// List page for Asset Repair Consumed Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAssetRepairConsumedItemList } from "../hooks/asset-repair-consumed-item.hooks.js";
import { assetRepairConsumedItemColumns } from "../columns/asset-repair-consumed-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssetRepairConsumedItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAssetRepairConsumedItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Asset Repair Consumed Item</h1>
        <Button onClick={() => router.push("/asset-repair-consumed-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={assetRepairConsumedItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/asset-repair-consumed-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}