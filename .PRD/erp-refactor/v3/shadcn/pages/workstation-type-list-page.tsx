"use client";

// List page for Workstation Type
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useWorkstationTypeList } from "../hooks/workstation-type.hooks.js";
import { workstationTypeColumns } from "../columns/workstation-type-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WorkstationTypeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useWorkstationTypeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Workstation Type</h1>
        <Button onClick={() => router.push("/workstation-type/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={workstationTypeColumns}
              data={data}
              onRowClick={(row) => router.push(`/workstation-type/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}