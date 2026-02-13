"use client";

// List page for Monthly Distribution Percentage
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useMonthlyDistributionPercentageList } from "../hooks/monthly-distribution-percentage.hooks.js";
import { monthlyDistributionPercentageColumns } from "../columns/monthly-distribution-percentage-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MonthlyDistributionPercentageListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useMonthlyDistributionPercentageList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Monthly Distribution Percentage</h1>
        <Button onClick={() => router.push("/monthly-distribution-percentage/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={monthlyDistributionPercentageColumns}
              data={data}
              onRowClick={(row) => router.push(`/monthly-distribution-percentage/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}