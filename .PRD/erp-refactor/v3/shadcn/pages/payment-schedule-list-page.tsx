"use client";

// List page for Payment Schedule
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePaymentScheduleList } from "../hooks/payment-schedule.hooks.js";
import { paymentScheduleColumns } from "../columns/payment-schedule-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentScheduleListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePaymentScheduleList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payment Schedule</h1>
        <Button onClick={() => router.push("/payment-schedule/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={paymentScheduleColumns}
              data={data}
              onRowClick={(row) => router.push(`/payment-schedule/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}