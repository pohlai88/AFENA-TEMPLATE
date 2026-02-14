"use client";

// List page for Activity Cost
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useActivityCostList } from "../hooks/activity-cost.hooks.js";
import { activityCostColumns } from "../columns/activity-cost-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ActivityCostListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useActivityCostList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Activity Cost</h1>
        <Button onClick={() => router.push("/activity-cost/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={activityCostColumns}
              data={data}
              onRowClick={(row) => router.push(`/activity-cost/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}