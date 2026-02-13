"use client";

// List page for Shipment Parcel Template
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useShipmentParcelTemplateList } from "../hooks/shipment-parcel-template.hooks.js";
import { shipmentParcelTemplateColumns } from "../columns/shipment-parcel-template-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ShipmentParcelTemplateListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useShipmentParcelTemplateList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Shipment Parcel Template</h1>
        <Button onClick={() => router.push("/shipment-parcel-template/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={shipmentParcelTemplateColumns}
              data={data}
              onRowClick={(row) => router.push(`/shipment-parcel-template/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}