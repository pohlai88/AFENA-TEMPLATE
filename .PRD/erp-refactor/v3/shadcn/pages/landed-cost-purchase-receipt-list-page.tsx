"use client";

// List page for Landed Cost Purchase Receipt
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useLandedCostPurchaseReceiptList } from "../hooks/landed-cost-purchase-receipt.hooks.js";
import { landedCostPurchaseReceiptColumns } from "../columns/landed-cost-purchase-receipt-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LandedCostPurchaseReceiptListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useLandedCostPurchaseReceiptList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Landed Cost Purchase Receipt</h1>
        <Button onClick={() => router.push("/landed-cost-purchase-receipt/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={landedCostPurchaseReceiptColumns}
              data={data}
              onRowClick={(row) => router.push(`/landed-cost-purchase-receipt/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}