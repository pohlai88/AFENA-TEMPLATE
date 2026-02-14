"use client";

// List page for Employee Group Table
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useEmployeeGroupTableList } from "../hooks/employee-group-table.hooks.js";
import { employeeGroupTableColumns } from "../columns/employee-group-table-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmployeeGroupTableListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useEmployeeGroupTableList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Employee Group Table</h1>
        <Button onClick={() => router.push("/employee-group-table/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={employeeGroupTableColumns}
              data={data}
              onRowClick={(row) => router.push(`/employee-group-table/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}