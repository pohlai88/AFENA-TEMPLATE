"use client";

// List page for Payment Term
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePaymentTermList } from "../hooks/payment-term.hooks.js";
import { paymentTermColumns } from "../columns/payment-term-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentTermListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePaymentTermList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payment Term</h1>
        <Button onClick={() => router.push("/payment-term/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={paymentTermColumns}
              data={data}
              onRowClick={(row) => router.push(`/payment-term/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}