"use client";

// List page for Blanket Order Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBlanketOrderItemList } from "../hooks/blanket-order-item.hooks.js";
import { blanketOrderItemColumns } from "../columns/blanket-order-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BlanketOrderItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBlanketOrderItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Blanket Order Item</h1>
        <Button onClick={() => router.push("/blanket-order-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={blanketOrderItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/blanket-order-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}