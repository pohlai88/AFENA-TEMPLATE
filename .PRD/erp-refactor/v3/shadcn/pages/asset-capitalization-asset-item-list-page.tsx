"use client";

// List page for Asset Capitalization Asset Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAssetCapitalizationAssetItemList } from "../hooks/asset-capitalization-asset-item.hooks.js";
import { assetCapitalizationAssetItemColumns } from "../columns/asset-capitalization-asset-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssetCapitalizationAssetItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAssetCapitalizationAssetItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Asset Capitalization Asset Item</h1>
        <Button onClick={() => router.push("/asset-capitalization-asset-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={assetCapitalizationAssetItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/asset-capitalization-asset-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}