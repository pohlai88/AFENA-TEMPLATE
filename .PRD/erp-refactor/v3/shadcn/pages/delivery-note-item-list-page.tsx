"use client";

// List page for Delivery Note Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useDeliveryNoteItemList } from "../hooks/delivery-note-item.hooks.js";
import { deliveryNoteItemColumns } from "../columns/delivery-note-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DeliveryNoteItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useDeliveryNoteItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Delivery Note Item</h1>
        <Button onClick={() => router.push("/delivery-note-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={deliveryNoteItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/delivery-note-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}