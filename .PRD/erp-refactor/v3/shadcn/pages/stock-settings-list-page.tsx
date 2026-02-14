"use client";

// List page for Stock Settings
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useStockSettingsList } from "../hooks/stock-settings.hooks.js";
import { stockSettingsColumns } from "../columns/stock-settings-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StockSettingsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useStockSettingsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Stock Settings</h1>
        <Button onClick={() => router.push("/stock-settings/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={stockSettingsColumns}
              data={data}
              onRowClick={(row) => router.push(`/stock-settings/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}