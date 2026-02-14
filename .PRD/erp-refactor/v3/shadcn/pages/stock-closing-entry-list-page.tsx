"use client";

// List page for Stock Closing Entry
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useStockClosingEntryList } from "../hooks/stock-closing-entry.hooks.js";
import { stockClosingEntryColumns } from "../columns/stock-closing-entry-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StockClosingEntryListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useStockClosingEntryList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Stock Closing Entry</h1>
        <Button onClick={() => router.push("/stock-closing-entry/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={stockClosingEntryColumns}
              data={data}
              onRowClick={(row) => router.push(`/stock-closing-entry/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}