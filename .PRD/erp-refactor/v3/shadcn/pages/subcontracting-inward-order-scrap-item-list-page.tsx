"use client";

// List page for Subcontracting Inward Order Scrap Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSubcontractingInwardOrderScrapItemList } from "../hooks/subcontracting-inward-order-scrap-item.hooks.js";
import { subcontractingInwardOrderScrapItemColumns } from "../columns/subcontracting-inward-order-scrap-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubcontractingInwardOrderScrapItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSubcontractingInwardOrderScrapItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Subcontracting Inward Order Scrap Item</h1>
        <Button onClick={() => router.push("/subcontracting-inward-order-scrap-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={subcontractingInwardOrderScrapItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/subcontracting-inward-order-scrap-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}