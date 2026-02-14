"use client";

// List page for Item Variant Settings
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useItemVariantSettingsList } from "../hooks/item-variant-settings.hooks.js";
import { itemVariantSettingsColumns } from "../columns/item-variant-settings-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemVariantSettingsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useItemVariantSettingsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Item Variant Settings</h1>
        <Button onClick={() => router.push("/item-variant-settings/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={itemVariantSettingsColumns}
              data={data}
              onRowClick={(row) => router.push(`/item-variant-settings/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}