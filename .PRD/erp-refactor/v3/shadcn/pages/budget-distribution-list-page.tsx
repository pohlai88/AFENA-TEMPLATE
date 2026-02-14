"use client";

// List page for Budget Distribution
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBudgetDistributionList } from "../hooks/budget-distribution.hooks.js";
import { budgetDistributionColumns } from "../columns/budget-distribution-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BudgetDistributionListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBudgetDistributionList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Budget Distribution</h1>
        <Button onClick={() => router.push("/budget-distribution/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={budgetDistributionColumns}
              data={data}
              onRowClick={(row) => router.push(`/budget-distribution/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}