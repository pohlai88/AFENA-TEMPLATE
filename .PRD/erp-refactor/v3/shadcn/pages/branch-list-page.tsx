"use client";

// List page for Branch
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBranchList } from "../hooks/branch.hooks.js";
import { branchColumns } from "../columns/branch-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BranchListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBranchList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Branch</h1>
        <Button onClick={() => router.push("/branch/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={branchColumns}
              data={data}
              onRowClick={(row) => router.push(`/branch/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}