"use client";

// List page for Buying Settings
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBuyingSettingsList } from "../hooks/buying-settings.hooks.js";
import { buyingSettingsColumns } from "../columns/buying-settings-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BuyingSettingsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBuyingSettingsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Buying Settings</h1>
        <Button onClick={() => router.push("/buying-settings/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={buyingSettingsColumns}
              data={data}
              onRowClick={(row) => router.push(`/buying-settings/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}