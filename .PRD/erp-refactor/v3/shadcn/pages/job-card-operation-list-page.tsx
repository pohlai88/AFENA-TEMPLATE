"use client";

// List page for Job Card Operation
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useJobCardOperationList } from "../hooks/job-card-operation.hooks.js";
import { jobCardOperationColumns } from "../columns/job-card-operation-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function JobCardOperationListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useJobCardOperationList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Job Card Operation</h1>
        <Button onClick={() => router.push("/job-card-operation/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={jobCardOperationColumns}
              data={data}
              onRowClick={(row) => router.push(`/job-card-operation/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}