"use client";

// List page for Employee External Work History
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useEmployeeExternalWorkHistoryList } from "../hooks/employee-external-work-history.hooks.js";
import { employeeExternalWorkHistoryColumns } from "../columns/employee-external-work-history-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmployeeExternalWorkHistoryListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useEmployeeExternalWorkHistoryList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Employee External Work History</h1>
        <Button onClick={() => router.push("/employee-external-work-history/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={employeeExternalWorkHistoryColumns}
              data={data}
              onRowClick={(row) => router.push(`/employee-external-work-history/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}