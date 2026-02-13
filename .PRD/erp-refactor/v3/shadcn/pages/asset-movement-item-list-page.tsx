"use client";

// List page for Asset Movement Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAssetMovementItemList } from "../hooks/asset-movement-item.hooks.js";
import { assetMovementItemColumns } from "../columns/asset-movement-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssetMovementItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAssetMovementItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Asset Movement Item</h1>
        <Button onClick={() => router.push("/asset-movement-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={assetMovementItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/asset-movement-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}