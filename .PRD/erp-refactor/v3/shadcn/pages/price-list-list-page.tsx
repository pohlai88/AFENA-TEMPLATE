"use client";

// List page for Price List
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePriceListList } from "../hooks/price-list.hooks.js";
import { priceListColumns } from "../columns/price-list-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PriceListListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePriceListList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Price List</h1>
        <Button onClick={() => router.push("/price-list/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={priceListColumns}
              data={data}
              onRowClick={(row) => router.push(`/price-list/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}