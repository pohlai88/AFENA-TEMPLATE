"use client";

// List page for Bank Reconciliation Tool
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBankReconciliationToolList } from "../hooks/bank-reconciliation-tool.hooks.js";
import { bankReconciliationToolColumns } from "../columns/bank-reconciliation-tool-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BankReconciliationToolListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBankReconciliationToolList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bank Reconciliation Tool</h1>
        <Button onClick={() => router.push("/bank-reconciliation-tool/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bankReconciliationToolColumns}
              data={data}
              onRowClick={(row) => router.push(`/bank-reconciliation-tool/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}