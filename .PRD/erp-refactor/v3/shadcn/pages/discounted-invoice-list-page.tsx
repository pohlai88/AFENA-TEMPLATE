"use client";

// List page for Discounted Invoice
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useDiscountedInvoiceList } from "../hooks/discounted-invoice.hooks.js";
import { discountedInvoiceColumns } from "../columns/discounted-invoice-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DiscountedInvoiceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useDiscountedInvoiceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Discounted Invoice</h1>
        <Button onClick={() => router.push("/discounted-invoice/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={discountedInvoiceColumns}
              data={data}
              onRowClick={(row) => router.push(`/discounted-invoice/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}