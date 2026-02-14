"use client";

// List page for Batch
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBatchList } from "../hooks/batch.hooks.js";
import { batchColumns } from "../columns/batch-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BatchListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBatchList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Batch</h1>
        <Button onClick={() => router.push("/batch/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={batchColumns}
              data={data}
              onRowClick={(row) => router.push(`/batch/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}