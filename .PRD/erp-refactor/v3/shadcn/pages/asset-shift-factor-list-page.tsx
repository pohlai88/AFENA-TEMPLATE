"use client";

// List page for Asset Shift Factor
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAssetShiftFactorList } from "../hooks/asset-shift-factor.hooks.js";
import { assetShiftFactorColumns } from "../columns/asset-shift-factor-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssetShiftFactorListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAssetShiftFactorList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Asset Shift Factor</h1>
        <Button onClick={() => router.push("/asset-shift-factor/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={assetShiftFactorColumns}
              data={data}
              onRowClick={(row) => router.push(`/asset-shift-factor/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}