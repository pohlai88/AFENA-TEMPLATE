"use client";

// List page for Sales Order Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSalesOrderItemList } from "../hooks/sales-order-item.hooks.js";
import { salesOrderItemColumns } from "../columns/sales-order-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SalesOrderItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSalesOrderItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales Order Item</h1>
        <Button onClick={() => router.push("/sales-order-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={salesOrderItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/sales-order-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}