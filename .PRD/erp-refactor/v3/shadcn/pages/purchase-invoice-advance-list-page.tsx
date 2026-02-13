"use client";

// List page for Purchase Invoice Advance
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePurchaseInvoiceAdvanceList } from "../hooks/purchase-invoice-advance.hooks.js";
import { purchaseInvoiceAdvanceColumns } from "../columns/purchase-invoice-advance-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PurchaseInvoiceAdvanceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePurchaseInvoiceAdvanceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Purchase Invoice Advance</h1>
        <Button onClick={() => router.push("/purchase-invoice-advance/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={purchaseInvoiceAdvanceColumns}
              data={data}
              onRowClick={(row) => router.push(`/purchase-invoice-advance/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}