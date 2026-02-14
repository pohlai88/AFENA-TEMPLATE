"use client";

// List page for Selling Settings
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSellingSettingsList } from "../hooks/selling-settings.hooks.js";
import { sellingSettingsColumns } from "../columns/selling-settings-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SellingSettingsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSellingSettingsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Selling Settings</h1>
        <Button onClick={() => router.push("/selling-settings/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={sellingSettingsColumns}
              data={data}
              onRowClick={(row) => router.push(`/selling-settings/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}