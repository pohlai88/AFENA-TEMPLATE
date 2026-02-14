"use client";

// List page for Sales Stage
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSalesStageList } from "../hooks/sales-stage.hooks.js";
import { salesStageColumns } from "../columns/sales-stage-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SalesStageListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSalesStageList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales Stage</h1>
        <Button onClick={() => router.push("/sales-stage/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={salesStageColumns}
              data={data}
              onRowClick={(row) => router.push(`/sales-stage/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}