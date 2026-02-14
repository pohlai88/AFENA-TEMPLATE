"use client";

// List page for Process Payment Reconciliation Log Allocations
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProcessPaymentReconciliationLogAllocationsList } from "../hooks/process-payment-reconciliation-log-allocations.hooks.js";
import { processPaymentReconciliationLogAllocationsColumns } from "../columns/process-payment-reconciliation-log-allocations-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProcessPaymentReconciliationLogAllocationsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProcessPaymentReconciliationLogAllocationsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Process Payment Reconciliation Log Allocations</h1>
        <Button onClick={() => router.push("/process-payment-reconciliation-log-allocations/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={processPaymentReconciliationLogAllocationsColumns}
              data={data}
              onRowClick={(row) => router.push(`/process-payment-reconciliation-log-allocations/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}