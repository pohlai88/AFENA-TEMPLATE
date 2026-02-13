"use client";

// List page for Sales Invoice Payment
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSalesInvoicePaymentList } from "../hooks/sales-invoice-payment.hooks.js";
import { salesInvoicePaymentColumns } from "../columns/sales-invoice-payment-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SalesInvoicePaymentListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSalesInvoicePaymentList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales Invoice Payment</h1>
        <Button onClick={() => router.push("/sales-invoice-payment/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={salesInvoicePaymentColumns}
              data={data}
              onRowClick={(row) => router.push(`/sales-invoice-payment/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}