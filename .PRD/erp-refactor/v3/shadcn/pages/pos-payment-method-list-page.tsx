"use client";

// List page for POS Payment Method
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePosPaymentMethodList } from "../hooks/pos-payment-method.hooks.js";
import { posPaymentMethodColumns } from "../columns/pos-payment-method-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PosPaymentMethodListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePosPaymentMethodList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">POS Payment Method</h1>
        <Button onClick={() => router.push("/pos-payment-method/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={posPaymentMethodColumns}
              data={data}
              onRowClick={(row) => router.push(`/pos-payment-method/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}