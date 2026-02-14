"use client";

// List page for Production Plan
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProductionPlanList } from "../hooks/production-plan.hooks.js";
import { productionPlanColumns } from "../columns/production-plan-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductionPlanListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProductionPlanList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Production Plan</h1>
        <Button onClick={() => router.push("/production-plan/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={productionPlanColumns}
              data={data}
              onRowClick={(row) => router.push(`/production-plan/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}