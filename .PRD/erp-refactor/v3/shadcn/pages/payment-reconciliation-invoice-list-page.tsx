"use client";

// List page for Payment Reconciliation Invoice
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePaymentReconciliationInvoiceList } from "../hooks/payment-reconciliation-invoice.hooks.js";
import { paymentReconciliationInvoiceColumns } from "../columns/payment-reconciliation-invoice-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentReconciliationInvoiceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePaymentReconciliationInvoiceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payment Reconciliation Invoice</h1>
        <Button onClick={() => router.push("/payment-reconciliation-invoice/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={paymentReconciliationInvoiceColumns}
              data={data}
              onRowClick={(row) => router.push(`/payment-reconciliation-invoice/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}