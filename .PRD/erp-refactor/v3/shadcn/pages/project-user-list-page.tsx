"use client";

// List page for Project User
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProjectUserList } from "../hooks/project-user.hooks.js";
import { projectUserColumns } from "../columns/project-user-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProjectUserListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProjectUserList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Project User</h1>
        <Button onClick={() => router.push("/project-user/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={projectUserColumns}
              data={data}
              onRowClick={(row) => router.push(`/project-user/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}