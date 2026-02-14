"use client";

// List page for Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useItemList } from "../hooks/item.hooks.js";
import { itemColumns } from "../columns/item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Item</h1>
        <Button onClick={() => router.push("/item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={itemColumns}
              data={data}
              onRowClick={(row) => router.push(`/item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}