"use client";

// List page for Production Plan Sub Assembly Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProductionPlanSubAssemblyItemList } from "../hooks/production-plan-sub-assembly-item.hooks.js";
import { productionPlanSubAssemblyItemColumns } from "../columns/production-plan-sub-assembly-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductionPlanSubAssemblyItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProductionPlanSubAssemblyItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Production Plan Sub Assembly Item</h1>
        <Button onClick={() => router.push("/production-plan-sub-assembly-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={productionPlanSubAssemblyItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/production-plan-sub-assembly-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}