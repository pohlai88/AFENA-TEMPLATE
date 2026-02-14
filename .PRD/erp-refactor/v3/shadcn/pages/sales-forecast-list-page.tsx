"use client";

// List page for Sales Forecast
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSalesForecastList } from "../hooks/sales-forecast.hooks.js";
import { salesForecastColumns } from "../columns/sales-forecast-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SalesForecastListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSalesForecastList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales Forecast</h1>
        <Button onClick={() => router.push("/sales-forecast/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={salesForecastColumns}
              data={data}
              onRowClick={(row) => router.push(`/sales-forecast/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}