"use client";

// List page for Project Type
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProjectTypeList } from "../hooks/project-type.hooks.js";
import { projectTypeColumns } from "../columns/project-type-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProjectTypeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProjectTypeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Project Type</h1>
        <Button onClick={() => router.push("/project-type/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={projectTypeColumns}
              data={data}
              onRowClick={(row) => router.push(`/project-type/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}