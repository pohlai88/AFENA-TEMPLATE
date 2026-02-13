"use client";

// List page for Production Plan Sales Order
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProductionPlanSalesOrderList } from "../hooks/production-plan-sales-order.hooks.js";
import { productionPlanSalesOrderColumns } from "../columns/production-plan-sales-order-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductionPlanSalesOrderListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProductionPlanSalesOrderList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Production Plan Sales Order</h1>
        <Button onClick={() => router.push("/production-plan-sales-order/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={productionPlanSalesOrderColumns}
              data={data}
              onRowClick={(row) => router.push(`/production-plan-sales-order/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}