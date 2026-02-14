"use client";

// List page for Subcontracting Order Service Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSubcontractingOrderServiceItemList } from "../hooks/subcontracting-order-service-item.hooks.js";
import { subcontractingOrderServiceItemColumns } from "../columns/subcontracting-order-service-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubcontractingOrderServiceItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSubcontractingOrderServiceItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Subcontracting Order Service Item</h1>
        <Button onClick={() => router.push("/subcontracting-order-service-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={subcontractingOrderServiceItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/subcontracting-order-service-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}