"use client";

// List page for Employee
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useEmployeeList } from "../hooks/employee.hooks.js";
import { employeeColumns } from "../columns/employee-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmployeeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useEmployeeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Employee</h1>
        <Button onClick={() => router.push("/employee/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={employeeColumns}
              data={data}
              onRowClick={(row) => router.push(`/employee/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}