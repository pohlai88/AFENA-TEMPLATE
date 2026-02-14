"use client";

// List page for Product Bundle
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProductBundleList } from "../hooks/product-bundle.hooks.js";
import { productBundleColumns } from "../columns/product-bundle-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductBundleListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProductBundleList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Product Bundle</h1>
        <Button onClick={() => router.push("/product-bundle/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={productBundleColumns}
              data={data}
              onRowClick={(row) => router.push(`/product-bundle/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}