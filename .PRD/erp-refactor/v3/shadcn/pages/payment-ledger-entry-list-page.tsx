"use client";

// List page for Payment Ledger Entry
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePaymentLedgerEntryList } from "../hooks/payment-ledger-entry.hooks.js";
import { paymentLedgerEntryColumns } from "../columns/payment-ledger-entry-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentLedgerEntryListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePaymentLedgerEntryList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payment Ledger Entry</h1>
        <Button onClick={() => router.push("/payment-ledger-entry/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={paymentLedgerEntryColumns}
              data={data}
              onRowClick={(row) => router.push(`/payment-ledger-entry/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}