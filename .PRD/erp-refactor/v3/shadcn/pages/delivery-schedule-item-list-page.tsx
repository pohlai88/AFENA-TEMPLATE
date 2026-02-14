"use client";

// List page for Delivery Schedule Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useDeliveryScheduleItemList } from "../hooks/delivery-schedule-item.hooks.js";
import { deliveryScheduleItemColumns } from "../columns/delivery-schedule-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DeliveryScheduleItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useDeliveryScheduleItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Delivery Schedule Item</h1>
        <Button onClick={() => router.push("/delivery-schedule-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={deliveryScheduleItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/delivery-schedule-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}