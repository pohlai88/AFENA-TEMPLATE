"use client";

// List page for Workstation Working Hour
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useWorkstationWorkingHourList } from "../hooks/workstation-working-hour.hooks.js";
import { workstationWorkingHourColumns } from "../columns/workstation-working-hour-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WorkstationWorkingHourListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useWorkstationWorkingHourList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Workstation Working Hour</h1>
        <Button onClick={() => router.push("/workstation-working-hour/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={workstationWorkingHourColumns}
              data={data}
              onRowClick={(row) => router.push(`/workstation-working-hour/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}