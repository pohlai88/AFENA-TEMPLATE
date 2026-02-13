"use client";

// List page for Stock Closing Balance
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useStockClosingBalanceList } from "../hooks/stock-closing-balance.hooks.js";
import { stockClosingBalanceColumns } from "../columns/stock-closing-balance-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StockClosingBalanceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useStockClosingBalanceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Stock Closing Balance</h1>
        <Button onClick={() => router.push("/stock-closing-balance/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={stockClosingBalanceColumns}
              data={data}
              onRowClick={(row) => router.push(`/stock-closing-balance/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}