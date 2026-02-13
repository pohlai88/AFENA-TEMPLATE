"use client";

// List page for Stock Reconciliation
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useStockReconciliationList } from "../hooks/stock-reconciliation.hooks.js";
import { stockReconciliationColumns } from "../columns/stock-reconciliation-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StockReconciliationListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useStockReconciliationList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Stock Reconciliation</h1>
        <Button onClick={() => router.push("/stock-reconciliation/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={stockReconciliationColumns}
              data={data}
              onRowClick={(row) => router.push(`/stock-reconciliation/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}