"use client";

// List page for Stock Entry Detail
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useStockEntryDetailList } from "../hooks/stock-entry-detail.hooks.js";
import { stockEntryDetailColumns } from "../columns/stock-entry-detail-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StockEntryDetailListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useStockEntryDetailList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Stock Entry Detail</h1>
        <Button onClick={() => router.push("/stock-entry-detail/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={stockEntryDetailColumns}
              data={data}
              onRowClick={(row) => router.push(`/stock-entry-detail/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}