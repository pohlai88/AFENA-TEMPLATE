"use client";

// List page for POS Invoice
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePosInvoiceList } from "../hooks/pos-invoice.hooks.js";
import { posInvoiceColumns } from "../columns/pos-invoice-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PosInvoiceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePosInvoiceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">POS Invoice</h1>
        <Button onClick={() => router.push("/pos-invoice/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={posInvoiceColumns}
              data={data}
              onRowClick={(row) => router.push(`/pos-invoice/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}