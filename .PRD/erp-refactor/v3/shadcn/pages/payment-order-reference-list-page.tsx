"use client";

// List page for Payment Order Reference
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePaymentOrderReferenceList } from "../hooks/payment-order-reference.hooks.js";
import { paymentOrderReferenceColumns } from "../columns/payment-order-reference-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentOrderReferenceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePaymentOrderReferenceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payment Order Reference</h1>
        <Button onClick={() => router.push("/payment-order-reference/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={paymentOrderReferenceColumns}
              data={data}
              onRowClick={(row) => router.push(`/payment-order-reference/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}