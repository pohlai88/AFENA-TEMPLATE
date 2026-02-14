"use client";

// List page for Payment Entry Deduction
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePaymentEntryDeductionList } from "../hooks/payment-entry-deduction.hooks.js";
import { paymentEntryDeductionColumns } from "../columns/payment-entry-deduction-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentEntryDeductionListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePaymentEntryDeductionList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payment Entry Deduction</h1>
        <Button onClick={() => router.push("/payment-entry-deduction/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={paymentEntryDeductionColumns}
              data={data}
              onRowClick={(row) => router.push(`/payment-entry-deduction/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}