"use client";

// List page for Stock Reservation Entry
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useStockReservationEntryList } from "../hooks/stock-reservation-entry.hooks.js";
import { stockReservationEntryColumns } from "../columns/stock-reservation-entry-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StockReservationEntryListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useStockReservationEntryList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Stock Reservation Entry</h1>
        <Button onClick={() => router.push("/stock-reservation-entry/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={stockReservationEntryColumns}
              data={data}
              onRowClick={(row) => router.push(`/stock-reservation-entry/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}