"use client";

// List page for Asset Movement
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAssetMovementList } from "../hooks/asset-movement.hooks.js";
import { assetMovementColumns } from "../columns/asset-movement-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssetMovementListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAssetMovementList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Asset Movement</h1>
        <Button onClick={() => router.push("/asset-movement/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={assetMovementColumns}
              data={data}
              onRowClick={(row) => router.push(`/asset-movement/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}