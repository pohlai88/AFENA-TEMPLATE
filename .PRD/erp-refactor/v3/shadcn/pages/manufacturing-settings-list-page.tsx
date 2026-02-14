"use client";

// List page for Manufacturing Settings
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useManufacturingSettingsList } from "../hooks/manufacturing-settings.hooks.js";
import { manufacturingSettingsColumns } from "../columns/manufacturing-settings-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ManufacturingSettingsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useManufacturingSettingsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manufacturing Settings</h1>
        <Button onClick={() => router.push("/manufacturing-settings/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={manufacturingSettingsColumns}
              data={data}
              onRowClick={(row) => router.push(`/manufacturing-settings/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}