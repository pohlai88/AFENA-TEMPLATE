"use client";

// List page for Work Order Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useWorkOrderItemList } from "../hooks/work-order-item.hooks.js";
import { workOrderItemColumns } from "../columns/work-order-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WorkOrderItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useWorkOrderItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Work Order Item</h1>
        <Button onClick={() => router.push("/work-order-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={workOrderItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/work-order-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}