"use client";

// List page for Employee Group
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useEmployeeGroupList } from "../hooks/employee-group.hooks.js";
import { employeeGroupColumns } from "../columns/employee-group-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmployeeGroupListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useEmployeeGroupList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Employee Group</h1>
        <Button onClick={() => router.push("/employee-group/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={employeeGroupColumns}
              data={data}
              onRowClick={(row) => router.push(`/employee-group/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}