"use client";

// List page for South Africa VAT Settings
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSouthAfricaVatSettingsList } from "../hooks/south-africa-vat-settings.hooks.js";
import { southAfricaVatSettingsColumns } from "../columns/south-africa-vat-settings-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SouthAfricaVatSettingsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSouthAfricaVatSettingsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">South Africa VAT Settings</h1>
        <Button onClick={() => router.push("/south-africa-vat-settings/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={southAfricaVatSettingsColumns}
              data={data}
              onRowClick={(row) => router.push(`/south-africa-vat-settings/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}