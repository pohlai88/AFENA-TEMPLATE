"use client";

// List page for Process Payment Reconciliation
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProcessPaymentReconciliationList } from "../hooks/process-payment-reconciliation.hooks.js";
import { processPaymentReconciliationColumns } from "../columns/process-payment-reconciliation-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProcessPaymentReconciliationListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProcessPaymentReconciliationList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Process Payment Reconciliation</h1>
        <Button onClick={() => router.push("/process-payment-reconciliation/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={processPaymentReconciliationColumns}
              data={data}
              onRowClick={(row) => router.push(`/process-payment-reconciliation/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}