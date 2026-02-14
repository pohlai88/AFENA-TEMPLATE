"use client";

// List page for Mode of Payment
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useModeOfPaymentList } from "../hooks/mode-of-payment.hooks.js";
import { modeOfPaymentColumns } from "../columns/mode-of-payment-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ModeOfPaymentListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useModeOfPaymentList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Mode of Payment</h1>
        <Button onClick={() => router.push("/mode-of-payment/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={modeOfPaymentColumns}
              data={data}
              onRowClick={(row) => router.push(`/mode-of-payment/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}