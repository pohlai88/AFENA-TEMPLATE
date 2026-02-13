"use client";

// List page for Landed Cost Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useLandedCostItemList } from "../hooks/landed-cost-item.hooks.js";
import { landedCostItemColumns } from "../columns/landed-cost-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LandedCostItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useLandedCostItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Landed Cost Item</h1>
        <Button onClick={() => router.push("/landed-cost-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={landedCostItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/landed-cost-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}