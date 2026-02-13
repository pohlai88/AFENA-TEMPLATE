"use client";

// List page for Asset Capitalization
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAssetCapitalizationList } from "../hooks/asset-capitalization.hooks.js";
import { assetCapitalizationColumns } from "../columns/asset-capitalization-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssetCapitalizationListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAssetCapitalizationList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Asset Capitalization</h1>
        <Button onClick={() => router.push("/asset-capitalization/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={assetCapitalizationColumns}
              data={data}
              onRowClick={(row) => router.push(`/asset-capitalization/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}