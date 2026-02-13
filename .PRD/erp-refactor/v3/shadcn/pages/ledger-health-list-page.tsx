"use client";

// List page for Ledger Health
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useLedgerHealthList } from "../hooks/ledger-health.hooks.js";
import { ledgerHealthColumns } from "../columns/ledger-health-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LedgerHealthListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useLedgerHealthList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Ledger Health</h1>
        <Button onClick={() => router.push("/ledger-health/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={ledgerHealthColumns}
              data={data}
              onRowClick={(row) => router.push(`/ledger-health/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}