"use client";

// List page for Stock Reposting Settings
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useStockRepostingSettingsList } from "../hooks/stock-reposting-settings.hooks.js";
import { stockRepostingSettingsColumns } from "../columns/stock-reposting-settings-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StockRepostingSettingsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useStockRepostingSettingsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Stock Reposting Settings</h1>
        <Button onClick={() => router.push("/stock-reposting-settings/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={stockRepostingSettingsColumns}
              data={data}
              onRowClick={(row) => router.push(`/stock-reposting-settings/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}