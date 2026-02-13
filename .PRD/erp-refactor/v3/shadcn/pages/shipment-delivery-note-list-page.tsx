"use client";

// List page for Shipment Delivery Note
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useShipmentDeliveryNoteList } from "../hooks/shipment-delivery-note.hooks.js";
import { shipmentDeliveryNoteColumns } from "../columns/shipment-delivery-note-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ShipmentDeliveryNoteListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useShipmentDeliveryNoteList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Shipment Delivery Note</h1>
        <Button onClick={() => router.push("/shipment-delivery-note/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={shipmentDeliveryNoteColumns}
              data={data}
              onRowClick={(row) => router.push(`/shipment-delivery-note/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}