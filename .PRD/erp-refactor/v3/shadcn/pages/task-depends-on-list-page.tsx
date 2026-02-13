"use client";

// List page for Task Depends On
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useTaskDependsOnList } from "../hooks/task-depends-on.hooks.js";
import { taskDependsOnColumns } from "../columns/task-depends-on-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TaskDependsOnListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useTaskDependsOnList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Task Depends On</h1>
        <Button onClick={() => router.push("/task-depends-on/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={taskDependsOnColumns}
              data={data}
              onRowClick={(row) => router.push(`/task-depends-on/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}