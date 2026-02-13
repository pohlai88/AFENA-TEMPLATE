"use client";

// List page for Purchase Invoice
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePurchaseInvoiceList } from "../hooks/purchase-invoice.hooks.js";
import { purchaseInvoiceColumns } from "../columns/purchase-invoice-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PurchaseInvoiceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePurchaseInvoiceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Purchase Invoice</h1>
        <Button onClick={() => router.push("/purchase-invoice/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={purchaseInvoiceColumns}
              data={data}
              onRowClick={(row) => router.push(`/purchase-invoice/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}