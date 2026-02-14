"use client";

// List page for Payment Request
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePaymentRequestList } from "../hooks/payment-request.hooks.js";
import { paymentRequestColumns } from "../columns/payment-request-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentRequestListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePaymentRequestList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payment Request</h1>
        <Button onClick={() => router.push("/payment-request/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={paymentRequestColumns}
              data={data}
              onRowClick={(row) => router.push(`/payment-request/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}