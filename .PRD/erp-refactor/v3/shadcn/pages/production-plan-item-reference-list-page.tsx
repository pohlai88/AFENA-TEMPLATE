"use client";

// List page for Production Plan Item Reference
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProductionPlanItemReferenceList } from "../hooks/production-plan-item-reference.hooks.js";
import { productionPlanItemReferenceColumns } from "../columns/production-plan-item-reference-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductionPlanItemReferenceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProductionPlanItemReferenceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Production Plan Item Reference</h1>
        <Button onClick={() => router.push("/production-plan-item-reference/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={productionPlanItemReferenceColumns}
              data={data}
              onRowClick={(row) => router.push(`/production-plan-item-reference/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}