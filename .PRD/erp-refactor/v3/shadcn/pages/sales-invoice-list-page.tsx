"use client";

// List page for Sales Invoice
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSalesInvoiceList } from "../hooks/sales-invoice.hooks.js";
import { salesInvoiceColumns } from "../columns/sales-invoice-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SalesInvoiceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSalesInvoiceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales Invoice</h1>
        <Button onClick={() => router.push("/sales-invoice/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={salesInvoiceColumns}
              data={data}
              onRowClick={(row) => router.push(`/sales-invoice/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}