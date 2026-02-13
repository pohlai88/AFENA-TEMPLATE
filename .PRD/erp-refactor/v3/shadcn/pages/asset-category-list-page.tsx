"use client";

// List page for Asset Category
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAssetCategoryList } from "../hooks/asset-category.hooks.js";
import { assetCategoryColumns } from "../columns/asset-category-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssetCategoryListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAssetCategoryList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Asset Category</h1>
        <Button onClick={() => router.push("/asset-category/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={assetCategoryColumns}
              data={data}
              onRowClick={(row) => router.push(`/asset-category/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}