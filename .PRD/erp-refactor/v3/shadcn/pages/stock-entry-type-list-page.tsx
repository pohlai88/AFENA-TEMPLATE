"use client";

// List page for Stock Entry Type
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useStockEntryTypeList } from "../hooks/stock-entry-type.hooks.js";
import { stockEntryTypeColumns } from "../columns/stock-entry-type-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StockEntryTypeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useStockEntryTypeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Stock Entry Type</h1>
        <Button onClick={() => router.push("/stock-entry-type/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={stockEntryTypeColumns}
              data={data}
              onRowClick={(row) => router.push(`/stock-entry-type/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}