"use client";

// List page for Packed Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePackedItemList } from "../hooks/packed-item.hooks.js";
import { packedItemColumns } from "../columns/packed-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PackedItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePackedItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Packed Item</h1>
        <Button onClick={() => router.push("/packed-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={packedItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/packed-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}