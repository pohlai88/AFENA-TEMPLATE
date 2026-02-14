"use client";

// List page for Payment Entry Reference
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePaymentEntryReferenceList } from "../hooks/payment-entry-reference.hooks.js";
import { paymentEntryReferenceColumns } from "../columns/payment-entry-reference-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentEntryReferenceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePaymentEntryReferenceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payment Entry Reference</h1>
        <Button onClick={() => router.push("/payment-entry-reference/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={paymentEntryReferenceColumns}
              data={data}
              onRowClick={(row) => router.push(`/payment-entry-reference/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}