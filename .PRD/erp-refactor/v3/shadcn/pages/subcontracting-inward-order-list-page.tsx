"use client";

// List page for Subcontracting Inward Order
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSubcontractingInwardOrderList } from "../hooks/subcontracting-inward-order.hooks.js";
import { subcontractingInwardOrderColumns } from "../columns/subcontracting-inward-order-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubcontractingInwardOrderListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSubcontractingInwardOrderList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Subcontracting Inward Order</h1>
        <Button onClick={() => router.push("/subcontracting-inward-order/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={subcontractingInwardOrderColumns}
              data={data}
              onRowClick={(row) => router.push(`/subcontracting-inward-order/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}