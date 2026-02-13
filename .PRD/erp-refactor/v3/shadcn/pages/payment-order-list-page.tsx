"use client";

// List page for Payment Order
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePaymentOrderList } from "../hooks/payment-order.hooks.js";
import { paymentOrderColumns } from "../columns/payment-order-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentOrderListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePaymentOrderList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payment Order</h1>
        <Button onClick={() => router.push("/payment-order/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={paymentOrderColumns}
              data={data}
              onRowClick={(row) => router.push(`/payment-order/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}