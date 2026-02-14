"use client";

// List page for Production Plan Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProductionPlanItemList } from "../hooks/production-plan-item.hooks.js";
import { productionPlanItemColumns } from "../columns/production-plan-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductionPlanItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProductionPlanItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Production Plan Item</h1>
        <Button onClick={() => router.push("/production-plan-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={productionPlanItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/production-plan-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}