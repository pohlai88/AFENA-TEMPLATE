"use client";

// List page for Dependent Task
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useDependentTaskList } from "../hooks/dependent-task.hooks.js";
import { dependentTaskColumns } from "../columns/dependent-task-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DependentTaskListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useDependentTaskList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dependent Task</h1>
        <Button onClick={() => router.push("/dependent-task/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={dependentTaskColumns}
              data={data}
              onRowClick={(row) => router.push(`/dependent-task/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}