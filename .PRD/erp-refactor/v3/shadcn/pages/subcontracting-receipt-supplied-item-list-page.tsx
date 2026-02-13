"use client";

// List page for Subcontracting Receipt Supplied Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSubcontractingReceiptSuppliedItemList } from "../hooks/subcontracting-receipt-supplied-item.hooks.js";
import { subcontractingReceiptSuppliedItemColumns } from "../columns/subcontracting-receipt-supplied-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubcontractingReceiptSuppliedItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSubcontractingReceiptSuppliedItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Subcontracting Receipt Supplied Item</h1>
        <Button onClick={() => router.push("/subcontracting-receipt-supplied-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={subcontractingReceiptSuppliedItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/subcontracting-receipt-supplied-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}