"use client";

// List page for Purchase Order Item Supplied
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePurchaseOrderItemSuppliedList } from "../hooks/purchase-order-item-supplied.hooks.js";
import { purchaseOrderItemSuppliedColumns } from "../columns/purchase-order-item-supplied-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PurchaseOrderItemSuppliedListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePurchaseOrderItemSuppliedList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Purchase Order Item Supplied</h1>
        <Button onClick={() => router.push("/purchase-order-item-supplied/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={purchaseOrderItemSuppliedColumns}
              data={data}
              onRowClick={(row) => router.push(`/purchase-order-item-supplied/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}