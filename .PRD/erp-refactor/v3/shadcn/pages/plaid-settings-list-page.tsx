"use client";

// List page for Plaid Settings
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePlaidSettingsList } from "../hooks/plaid-settings.hooks.js";
import { plaidSettingsColumns } from "../columns/plaid-settings-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PlaidSettingsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePlaidSettingsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Plaid Settings</h1>
        <Button onClick={() => router.push("/plaid-settings/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={plaidSettingsColumns}
              data={data}
              onRowClick={(row) => router.push(`/plaid-settings/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}