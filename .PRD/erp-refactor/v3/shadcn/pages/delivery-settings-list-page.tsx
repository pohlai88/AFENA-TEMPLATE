"use client";

// List page for Delivery Settings
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useDeliverySettingsList } from "../hooks/delivery-settings.hooks.js";
import { deliverySettingsColumns } from "../columns/delivery-settings-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DeliverySettingsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useDeliverySettingsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Delivery Settings</h1>
        <Button onClick={() => router.push("/delivery-settings/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={deliverySettingsColumns}
              data={data}
              onRowClick={(row) => router.push(`/delivery-settings/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}