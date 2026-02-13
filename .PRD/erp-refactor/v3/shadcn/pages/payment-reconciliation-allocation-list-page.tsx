"use client";

// List page for Payment Reconciliation Allocation
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePaymentReconciliationAllocationList } from "../hooks/payment-reconciliation-allocation.hooks.js";
import { paymentReconciliationAllocationColumns } from "../columns/payment-reconciliation-allocation-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentReconciliationAllocationListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePaymentReconciliationAllocationList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payment Reconciliation Allocation</h1>
        <Button onClick={() => router.push("/payment-reconciliation-allocation/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={paymentReconciliationAllocationColumns}
              data={data}
              onRowClick={(row) => router.push(`/payment-reconciliation-allocation/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}