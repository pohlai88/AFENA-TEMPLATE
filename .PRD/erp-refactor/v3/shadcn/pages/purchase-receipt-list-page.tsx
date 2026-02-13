"use client";

// List page for Purchase Receipt
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePurchaseReceiptList } from "../hooks/purchase-receipt.hooks.js";
import { purchaseReceiptColumns } from "../columns/purchase-receipt-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PurchaseReceiptListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePurchaseReceiptList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Purchase Receipt</h1>
        <Button onClick={() => router.push("/purchase-receipt/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={purchaseReceiptColumns}
              data={data}
              onRowClick={(row) => router.push(`/purchase-receipt/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}