"use client";

// List page for Employee Education
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useEmployeeEducationList } from "../hooks/employee-education.hooks.js";
import { employeeEducationColumns } from "../columns/employee-education-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmployeeEducationListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useEmployeeEducationList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Employee Education</h1>
        <Button onClick={() => router.push("/employee-education/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={employeeEducationColumns}
              data={data}
              onRowClick={(row) => router.push(`/employee-education/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}