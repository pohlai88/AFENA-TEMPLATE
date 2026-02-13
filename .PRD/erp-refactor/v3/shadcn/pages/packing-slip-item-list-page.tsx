"use client";

// List page for Packing Slip Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePackingSlipItemList } from "../hooks/packing-slip-item.hooks.js";
import { packingSlipItemColumns } from "../columns/packing-slip-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PackingSlipItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePackingSlipItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Packing Slip Item</h1>
        <Button onClick={() => router.push("/packing-slip-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={packingSlipItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/packing-slip-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}