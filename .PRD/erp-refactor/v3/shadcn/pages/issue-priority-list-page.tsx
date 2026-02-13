"use client";

// List page for Issue Priority
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useIssuePriorityList } from "../hooks/issue-priority.hooks.js";
import { issuePriorityColumns } from "../columns/issue-priority-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function IssuePriorityListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useIssuePriorityList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Issue Priority</h1>
        <Button onClick={() => router.push("/issue-priority/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={issuePriorityColumns}
              data={data}
              onRowClick={(row) => router.push(`/issue-priority/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}