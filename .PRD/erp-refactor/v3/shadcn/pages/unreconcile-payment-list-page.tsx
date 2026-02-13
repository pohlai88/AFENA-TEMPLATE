"use client";

// List page for Unreconcile Payment
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useUnreconcilePaymentList } from "../hooks/unreconcile-payment.hooks.js";
import { unreconcilePaymentColumns } from "../columns/unreconcile-payment-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UnreconcilePaymentListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useUnreconcilePaymentList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Unreconcile Payment</h1>
        <Button onClick={() => router.push("/unreconcile-payment/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={unreconcilePaymentColumns}
              data={data}
              onRowClick={(row) => router.push(`/unreconcile-payment/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}