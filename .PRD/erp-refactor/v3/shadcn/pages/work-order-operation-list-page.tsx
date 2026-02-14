"use client";

// List page for Work Order Operation
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useWorkOrderOperationList } from "../hooks/work-order-operation.hooks.js";
import { workOrderOperationColumns } from "../columns/work-order-operation-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WorkOrderOperationListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useWorkOrderOperationList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Work Order Operation</h1>
        <Button onClick={() => router.push("/work-order-operation/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={workOrderOperationColumns}
              data={data}
              onRowClick={(row) => router.push(`/work-order-operation/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}