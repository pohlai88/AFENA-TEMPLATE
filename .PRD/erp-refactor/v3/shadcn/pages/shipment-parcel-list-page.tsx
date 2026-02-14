"use client";

// List page for Shipment Parcel
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useShipmentParcelList } from "../hooks/shipment-parcel.hooks.js";
import { shipmentParcelColumns } from "../columns/shipment-parcel-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ShipmentParcelListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useShipmentParcelList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Shipment Parcel</h1>
        <Button onClick={() => router.push("/shipment-parcel/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={shipmentParcelColumns}
              data={data}
              onRowClick={(row) => router.push(`/shipment-parcel/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}