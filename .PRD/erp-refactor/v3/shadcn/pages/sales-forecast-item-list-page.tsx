"use client";

// List page for Sales Forecast Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSalesForecastItemList } from "../hooks/sales-forecast-item.hooks.js";
import { salesForecastItemColumns } from "../columns/sales-forecast-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SalesForecastItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSalesForecastItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales Forecast Item</h1>
        <Button onClick={() => router.push("/sales-forecast-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={salesForecastItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/sales-forecast-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}