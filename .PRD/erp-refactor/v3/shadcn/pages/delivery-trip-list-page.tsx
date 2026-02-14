"use client";

// List page for Delivery Trip
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useDeliveryTripList } from "../hooks/delivery-trip.hooks.js";
import { deliveryTripColumns } from "../columns/delivery-trip-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DeliveryTripListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useDeliveryTripList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Delivery Trip</h1>
        <Button onClick={() => router.push("/delivery-trip/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={deliveryTripColumns}
              data={data}
              onRowClick={(row) => router.push(`/delivery-trip/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}