"use client";

// List page for POS Invoice Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePosInvoiceItemList } from "../hooks/pos-invoice-item.hooks.js";
import { posInvoiceItemColumns } from "../columns/pos-invoice-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PosInvoiceItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePosInvoiceItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">POS Invoice Item</h1>
        <Button onClick={() => router.push("/pos-invoice-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={posInvoiceItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/pos-invoice-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}