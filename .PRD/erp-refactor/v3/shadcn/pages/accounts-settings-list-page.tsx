"use client";

// List page for Accounts Settings
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAccountsSettingsList } from "../hooks/accounts-settings.hooks.js";
import { accountsSettingsColumns } from "../columns/accounts-settings-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AccountsSettingsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAccountsSettingsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Accounts Settings</h1>
        <Button onClick={() => router.push("/accounts-settings/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={accountsSettingsColumns}
              data={data}
              onRowClick={(row) => router.push(`/accounts-settings/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}