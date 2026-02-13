"use client";

// List page for Opening Invoice Creation Tool Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useOpeningInvoiceCreationToolItemList } from "../hooks/opening-invoice-creation-tool-item.hooks.js";
import { openingInvoiceCreationToolItemColumns } from "../columns/opening-invoice-creation-tool-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OpeningInvoiceCreationToolItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useOpeningInvoiceCreationToolItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Opening Invoice Creation Tool Item</h1>
        <Button onClick={() => router.push("/opening-invoice-creation-tool-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={openingInvoiceCreationToolItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/opening-invoice-creation-tool-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}