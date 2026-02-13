"use client";

// List page for Employee Internal Work History
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useEmployeeInternalWorkHistoryList } from "../hooks/employee-internal-work-history.hooks.js";
import { employeeInternalWorkHistoryColumns } from "../columns/employee-internal-work-history-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmployeeInternalWorkHistoryListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useEmployeeInternalWorkHistoryList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Employee Internal Work History</h1>
        <Button onClick={() => router.push("/employee-internal-work-history/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={employeeInternalWorkHistoryColumns}
              data={data}
              onRowClick={(row) => router.push(`/employee-internal-work-history/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}