"use client";

// List page for Accounting Period
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAccountingPeriodList } from "../hooks/accounting-period.hooks.js";
import { accountingPeriodColumns } from "../columns/accounting-period-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AccountingPeriodListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAccountingPeriodList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Accounting Period</h1>
        <Button onClick={() => router.push("/accounting-period/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={accountingPeriodColumns}
              data={data}
              onRowClick={(row) => router.push(`/accounting-period/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}