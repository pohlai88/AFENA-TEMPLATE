"use client";

// List page for Project Update
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProjectUpdateList } from "../hooks/project-update.hooks.js";
import { projectUpdateColumns } from "../columns/project-update-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProjectUpdateListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProjectUpdateList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Project Update</h1>
        <Button onClick={() => router.push("/project-update/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={projectUpdateColumns}
              data={data}
              onRowClick={(row) => router.push(`/project-update/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}