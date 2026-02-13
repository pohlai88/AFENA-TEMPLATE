"use client";

// List page for Item Price
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useItemPriceList } from "../hooks/item-price.hooks.js";
import { itemPriceColumns } from "../columns/item-price-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemPriceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useItemPriceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Item Price</h1>
        <Button onClick={() => router.push("/item-price/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={itemPriceColumns}
              data={data}
              onRowClick={(row) => router.push(`/item-price/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}