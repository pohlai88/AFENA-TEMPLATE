"use client";

// List page for Task
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useTaskList } from "../hooks/task.hooks.js";
import { taskColumns } from "../columns/task-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TaskListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useTaskList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Task</h1>
        <Button onClick={() => router.push("/task/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={taskColumns}
              data={data}
              onRowClick={(row) => router.push(`/task/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}