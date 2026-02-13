"use client";

// List page for Product Bundle Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProductBundleItemList } from "../hooks/product-bundle-item.hooks.js";
import { productBundleItemColumns } from "../columns/product-bundle-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductBundleItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProductBundleItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Product Bundle Item</h1>
        <Button onClick={() => router.push("/product-bundle-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={productBundleItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/product-bundle-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}