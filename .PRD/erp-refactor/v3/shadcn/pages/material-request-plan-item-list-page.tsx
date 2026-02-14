"use client";

// List page for Material Request Plan Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useMaterialRequestPlanItemList } from "../hooks/material-request-plan-item.hooks.js";
import { materialRequestPlanItemColumns } from "../columns/material-request-plan-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MaterialRequestPlanItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useMaterialRequestPlanItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Material Request Plan Item</h1>
        <Button onClick={() => router.push("/material-request-plan-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={materialRequestPlanItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/material-request-plan-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}