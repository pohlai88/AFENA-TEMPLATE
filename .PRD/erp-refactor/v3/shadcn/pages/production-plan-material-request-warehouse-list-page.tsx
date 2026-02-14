"use client";

// List page for Production Plan Material Request Warehouse
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProductionPlanMaterialRequestWarehouseList } from "../hooks/production-plan-material-request-warehouse.hooks.js";
import { productionPlanMaterialRequestWarehouseColumns } from "../columns/production-plan-material-request-warehouse-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductionPlanMaterialRequestWarehouseListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProductionPlanMaterialRequestWarehouseList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Production Plan Material Request Warehouse</h1>
        <Button onClick={() => router.push("/production-plan-material-request-warehouse/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={productionPlanMaterialRequestWarehouseColumns}
              data={data}
              onRowClick={(row) => router.push(`/production-plan-material-request-warehouse/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}