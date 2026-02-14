"use client";

// List page for POS Settings
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePosSettingsList } from "../hooks/pos-settings.hooks.js";
import { posSettingsColumns } from "../columns/pos-settings-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PosSettingsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePosSettingsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">POS Settings</h1>
        <Button onClick={() => router.push("/pos-settings/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={posSettingsColumns}
              data={data}
              onRowClick={(row) => router.push(`/pos-settings/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}