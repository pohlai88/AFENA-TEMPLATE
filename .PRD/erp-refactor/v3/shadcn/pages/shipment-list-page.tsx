"use client";

// List page for Shipment
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useShipmentList } from "../hooks/shipment.hooks.js";
import { shipmentColumns } from "../columns/shipment-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ShipmentListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useShipmentList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Shipment</h1>
        <Button onClick={() => router.push("/shipment/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={shipmentColumns}
              data={data}
              onRowClick={(row) => router.push(`/shipment/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}