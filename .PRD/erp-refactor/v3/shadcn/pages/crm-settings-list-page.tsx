"use client";

// List page for CRM Settings
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCrmSettingsList } from "../hooks/crm-settings.hooks.js";
import { crmSettingsColumns } from "../columns/crm-settings-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CrmSettingsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCrmSettingsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">CRM Settings</h1>
        <Button onClick={() => router.push("/crm-settings/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={crmSettingsColumns}
              data={data}
              onRowClick={(row) => router.push(`/crm-settings/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}