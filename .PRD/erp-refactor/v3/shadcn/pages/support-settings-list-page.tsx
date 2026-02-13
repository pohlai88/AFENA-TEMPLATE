"use client";

// List page for Support Settings
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSupportSettingsList } from "../hooks/support-settings.hooks.js";
import { supportSettingsColumns } from "../columns/support-settings-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SupportSettingsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSupportSettingsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Support Settings</h1>
        <Button onClick={() => router.push("/support-settings/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={supportSettingsColumns}
              data={data}
              onRowClick={(row) => router.push(`/support-settings/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}