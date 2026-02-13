"use client";

// List page for Monthly Distribution
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useMonthlyDistributionList } from "../hooks/monthly-distribution.hooks.js";
import { monthlyDistributionColumns } from "../columns/monthly-distribution-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MonthlyDistributionListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useMonthlyDistributionList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Monthly Distribution</h1>
        <Button onClick={() => router.push("/monthly-distribution/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={monthlyDistributionColumns}
              data={data}
              onRowClick={(row) => router.push(`/monthly-distribution/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}