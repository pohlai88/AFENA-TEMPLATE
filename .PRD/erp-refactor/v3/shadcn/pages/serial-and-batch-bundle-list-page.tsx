"use client";

// List page for Serial and Batch Bundle
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSerialAndBatchBundleList } from "../hooks/serial-and-batch-bundle.hooks.js";
import { serialAndBatchBundleColumns } from "../columns/serial-and-batch-bundle-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SerialAndBatchBundleListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSerialAndBatchBundleList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Serial and Batch Bundle</h1>
        <Button onClick={() => router.push("/serial-and-batch-bundle/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={serialAndBatchBundleColumns}
              data={data}
              onRowClick={(row) => router.push(`/serial-and-batch-bundle/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}