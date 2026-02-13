"use client";

// List page for Payment Entry
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePaymentEntryList } from "../hooks/payment-entry.hooks.js";
import { paymentEntryColumns } from "../columns/payment-entry-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentEntryListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePaymentEntryList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payment Entry</h1>
        <Button onClick={() => router.push("/payment-entry/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={paymentEntryColumns}
              data={data}
              onRowClick={(row) => router.push(`/payment-entry/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}