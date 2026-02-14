"use client";

// List page for BOM Update Batch
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBomUpdateBatchList } from "../hooks/bom-update-batch.hooks.js";
import { bomUpdateBatchColumns } from "../columns/bom-update-batch-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BomUpdateBatchListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBomUpdateBatchList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">BOM Update Batch</h1>
        <Button onClick={() => router.push("/bom-update-batch/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bomUpdateBatchColumns}
              data={data}
              onRowClick={(row) => router.push(`/bom-update-batch/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}