"use client";

// List page for Asset
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAssetList } from "../hooks/asset.hooks.js";
import { assetColumns } from "../columns/asset-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssetListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAssetList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Asset</h1>
        <Button onClick={() => router.push("/asset/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={assetColumns}
              data={data}
              onRowClick={(row) => router.push(`/asset/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}