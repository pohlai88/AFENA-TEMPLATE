"use client";

// List page for Bank Transaction Payments
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBankTransactionPaymentsList } from "../hooks/bank-transaction-payments.hooks.js";
import { bankTransactionPaymentsColumns } from "../columns/bank-transaction-payments-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BankTransactionPaymentsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBankTransactionPaymentsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bank Transaction Payments</h1>
        <Button onClick={() => router.push("/bank-transaction-payments/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bankTransactionPaymentsColumns}
              data={data}
              onRowClick={(row) => router.push(`/bank-transaction-payments/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}