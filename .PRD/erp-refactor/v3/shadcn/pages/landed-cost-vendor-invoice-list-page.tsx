"use client";

// List page for Landed Cost Vendor Invoice
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useLandedCostVendorInvoiceList } from "../hooks/landed-cost-vendor-invoice.hooks.js";
import { landedCostVendorInvoiceColumns } from "../columns/landed-cost-vendor-invoice-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LandedCostVendorInvoiceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useLandedCostVendorInvoiceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Landed Cost Vendor Invoice</h1>
        <Button onClick={() => router.push("/landed-cost-vendor-invoice/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={landedCostVendorInvoiceColumns}
              data={data}
              onRowClick={(row) => router.push(`/landed-cost-vendor-invoice/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}