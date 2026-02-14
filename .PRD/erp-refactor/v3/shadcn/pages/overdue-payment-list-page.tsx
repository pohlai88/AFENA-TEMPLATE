"use client";

// List page for Overdue Payment
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useOverduePaymentList } from "../hooks/overdue-payment.hooks.js";
import { overduePaymentColumns } from "../columns/overdue-payment-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OverduePaymentListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useOverduePaymentList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Overdue Payment</h1>
        <Button onClick={() => router.push("/overdue-payment/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={overduePaymentColumns}
              data={data}
              onRowClick={(row) => router.push(`/overdue-payment/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}