"use client";

// List page for Delivery Stop
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useDeliveryStopList } from "../hooks/delivery-stop.hooks.js";
import { deliveryStopColumns } from "../columns/delivery-stop-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DeliveryStopListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useDeliveryStopList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Delivery Stop</h1>
        <Button onClick={() => router.push("/delivery-stop/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={deliveryStopColumns}
              data={data}
              onRowClick={(row) => router.push(`/delivery-stop/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}