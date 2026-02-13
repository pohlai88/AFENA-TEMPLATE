"use client";

// List page for Cost Center Allocation
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCostCenterAllocationList } from "../hooks/cost-center-allocation.hooks.js";
import { costCenterAllocationColumns } from "../columns/cost-center-allocation-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CostCenterAllocationListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCostCenterAllocationList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Cost Center Allocation</h1>
        <Button onClick={() => router.push("/cost-center-allocation/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={costCenterAllocationColumns}
              data={data}
              onRowClick={(row) => router.push(`/cost-center-allocation/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}