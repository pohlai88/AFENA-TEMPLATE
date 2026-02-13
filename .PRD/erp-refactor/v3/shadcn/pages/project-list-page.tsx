"use client";

// List page for Project
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProjectList } from "../hooks/project.hooks.js";
import { projectColumns } from "../columns/project-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProjectListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProjectList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Project</h1>
        <Button onClick={() => router.push("/project/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={projectColumns}
              data={data}
              onRowClick={(row) => router.push(`/project/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}