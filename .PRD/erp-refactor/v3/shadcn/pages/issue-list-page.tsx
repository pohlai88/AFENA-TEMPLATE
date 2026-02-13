"use client";

// List page for Issue
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useIssueList } from "../hooks/issue.hooks.js";
import { issueColumns } from "../columns/issue-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function IssueListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useIssueList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Issue</h1>
        <Button onClick={() => router.push("/issue/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={issueColumns}
              data={data}
              onRowClick={(row) => router.push(`/issue/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}