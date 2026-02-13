"use client";

// List page for Operation
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useOperationList } from "../hooks/operation.hooks.js";
import { operationColumns } from "../columns/operation-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OperationListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useOperationList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Operation</h1>
        <Button onClick={() => router.push("/operation/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={operationColumns}
              data={data}
              onRowClick={(row) => router.push(`/operation/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}