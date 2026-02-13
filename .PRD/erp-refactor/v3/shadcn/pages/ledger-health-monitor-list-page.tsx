"use client";

// List page for Ledger Health Monitor
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useLedgerHealthMonitorList } from "../hooks/ledger-health-monitor.hooks.js";
import { ledgerHealthMonitorColumns } from "../columns/ledger-health-monitor-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LedgerHealthMonitorListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useLedgerHealthMonitorList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Ledger Health Monitor</h1>
        <Button onClick={() => router.push("/ledger-health-monitor/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={ledgerHealthMonitorColumns}
              data={data}
              onRowClick={(row) => router.push(`/ledger-health-monitor/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}