"use client";

// List page for Asset Finance Book
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAssetFinanceBookList } from "../hooks/asset-finance-book.hooks.js";
import { assetFinanceBookColumns } from "../columns/asset-finance-book-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssetFinanceBookListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAssetFinanceBookList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Asset Finance Book</h1>
        <Button onClick={() => router.push("/asset-finance-book/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={assetFinanceBookColumns}
              data={data}
              onRowClick={(row) => router.push(`/asset-finance-book/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}