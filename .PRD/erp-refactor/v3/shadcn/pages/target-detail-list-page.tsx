"use client";

// List page for Target Detail
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useTargetDetailList } from "../hooks/target-detail.hooks.js";
import { targetDetailColumns } from "../columns/target-detail-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TargetDetailListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useTargetDetailList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Target Detail</h1>
        <Button onClick={() => router.push("/target-detail/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={targetDetailColumns}
              data={data}
              onRowClick={(row) => router.push(`/target-detail/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}