"use client";

// List page for Production Plan Material Request
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProductionPlanMaterialRequestList } from "../hooks/production-plan-material-request.hooks.js";
import { productionPlanMaterialRequestColumns } from "../columns/production-plan-material-request-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductionPlanMaterialRequestListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProductionPlanMaterialRequestList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Production Plan Material Request</h1>
        <Button onClick={() => router.push("/production-plan-material-request/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={productionPlanMaterialRequestColumns}
              data={data}
              onRowClick={(row) => router.push(`/production-plan-material-request/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}