"use client";

// List page for Task Type
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useTaskTypeList } from "../hooks/task-type.hooks.js";
import { taskTypeColumns } from "../columns/task-type-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TaskTypeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useTaskTypeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Task Type</h1>
        <Button onClick={() => router.push("/task-type/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={taskTypeColumns}
              data={data}
              onRowClick={(row) => router.push(`/task-type/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}