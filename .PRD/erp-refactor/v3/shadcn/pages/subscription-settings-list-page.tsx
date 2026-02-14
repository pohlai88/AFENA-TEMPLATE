"use client";

// List page for Subscription Settings
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSubscriptionSettingsList } from "../hooks/subscription-settings.hooks.js";
import { subscriptionSettingsColumns } from "../columns/subscription-settings-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubscriptionSettingsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSubscriptionSettingsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Subscription Settings</h1>
        <Button onClick={() => router.push("/subscription-settings/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={subscriptionSettingsColumns}
              data={data}
              onRowClick={(row) => router.push(`/subscription-settings/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}