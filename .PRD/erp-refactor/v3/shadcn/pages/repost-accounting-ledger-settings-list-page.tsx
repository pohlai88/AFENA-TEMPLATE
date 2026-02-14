"use client";

// List page for Repost Accounting Ledger Settings
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useRepostAccountingLedgerSettingsList } from "../hooks/repost-accounting-ledger-settings.hooks.js";
import { repostAccountingLedgerSettingsColumns } from "../columns/repost-accounting-ledger-settings-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RepostAccountingLedgerSettingsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useRepostAccountingLedgerSettingsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Repost Accounting Ledger Settings</h1>
        <Button onClick={() => router.push("/repost-accounting-ledger-settings/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={repostAccountingLedgerSettingsColumns}
              data={data}
              onRowClick={(row) => router.push(`/repost-accounting-ledger-settings/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}