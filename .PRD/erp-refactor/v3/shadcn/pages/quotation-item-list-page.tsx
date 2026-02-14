"use client";

// List page for Quotation Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQuotationItemList } from "../hooks/quotation-item.hooks.js";
import { quotationItemColumns } from "../columns/quotation-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuotationItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQuotationItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quotation Item</h1>
        <Button onClick={() => router.push("/quotation-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={quotationItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/quotation-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}