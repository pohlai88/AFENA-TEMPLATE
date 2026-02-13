"use client";

// List page for Subcontracting Order
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSubcontractingOrderList } from "../hooks/subcontracting-order.hooks.js";
import { subcontractingOrderColumns } from "../columns/subcontracting-order-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubcontractingOrderListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSubcontractingOrderList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Subcontracting Order</h1>
        <Button onClick={() => router.push("/subcontracting-order/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={subcontractingOrderColumns}
              data={data}
              onRowClick={(row) => router.push(`/subcontracting-order/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}