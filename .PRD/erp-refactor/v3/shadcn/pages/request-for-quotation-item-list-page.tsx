"use client";

// List page for Request for Quotation Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useRequestForQuotationItemList } from "../hooks/request-for-quotation-item.hooks.js";
import { requestForQuotationItemColumns } from "../columns/request-for-quotation-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RequestForQuotationItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useRequestForQuotationItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Request for Quotation Item</h1>
        <Button onClick={() => router.push("/request-for-quotation-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={requestForQuotationItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/request-for-quotation-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}