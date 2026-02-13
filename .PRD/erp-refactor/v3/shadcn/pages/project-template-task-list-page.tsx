"use client";

// List page for Project Template Task
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProjectTemplateTaskList } from "../hooks/project-template-task.hooks.js";
import { projectTemplateTaskColumns } from "../columns/project-template-task-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProjectTemplateTaskListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProjectTemplateTaskList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Project Template Task</h1>
        <Button onClick={() => router.push("/project-template-task/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={projectTemplateTaskColumns}
              data={data}
              onRowClick={(row) => router.push(`/project-template-task/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}