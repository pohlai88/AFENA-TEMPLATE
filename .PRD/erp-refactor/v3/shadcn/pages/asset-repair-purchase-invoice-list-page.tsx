"use client";

// List page for Asset Repair Purchase Invoice
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAssetRepairPurchaseInvoiceList } from "../hooks/asset-repair-purchase-invoice.hooks.js";
import { assetRepairPurchaseInvoiceColumns } from "../columns/asset-repair-purchase-invoice-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssetRepairPurchaseInvoiceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAssetRepairPurchaseInvoiceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Asset Repair Purchase Invoice</h1>
        <Button onClick={() => router.push("/asset-repair-purchase-invoice/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={assetRepairPurchaseInvoiceColumns}
              data={data}
              onRowClick={(row) => router.push(`/asset-repair-purchase-invoice/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}