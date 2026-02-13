"use client";

// List page for Ledger Health Monitor Company
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useLedgerHealthMonitorCompanyList } from "../hooks/ledger-health-monitor-company.hooks.js";
import { ledgerHealthMonitorCompanyColumns } from "../columns/ledger-health-monitor-company-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LedgerHealthMonitorCompanyListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useLedgerHealthMonitorCompanyList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Ledger Health Monitor Company</h1>
        <Button onClick={() => router.push("/ledger-health-monitor-company/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={ledgerHealthMonitorCompanyColumns}
              data={data}
              onRowClick={(row) => router.push(`/ledger-health-monitor-company/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}