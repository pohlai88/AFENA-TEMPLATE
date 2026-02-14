"use client";

// List page for Inventory Dimension
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useInventoryDimensionList } from "../hooks/inventory-dimension.hooks.js";
import { inventoryDimensionColumns } from "../columns/inventory-dimension-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InventoryDimensionListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useInventoryDimensionList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Dimension</h1>
        <Button onClick={() => router.push("/inventory-dimension/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={inventoryDimensionColumns}
              data={data}
              onRowClick={(row) => router.push(`/inventory-dimension/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}