"use client";

// List page for Item Wise Tax Detail
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useItemWiseTaxDetailList } from "../hooks/item-wise-tax-detail.hooks.js";
import { itemWiseTaxDetailColumns } from "../columns/item-wise-tax-detail-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemWiseTaxDetailListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useItemWiseTaxDetailList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Item Wise Tax Detail</h1>
        <Button onClick={() => router.push("/item-wise-tax-detail/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={itemWiseTaxDetailColumns}
              data={data}
              onRowClick={(row) => router.push(`/item-wise-tax-detail/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}