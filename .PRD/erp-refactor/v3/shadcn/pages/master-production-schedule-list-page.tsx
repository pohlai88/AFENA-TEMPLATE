"use client";

// List page for Master Production Schedule
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useMasterProductionScheduleList } from "../hooks/master-production-schedule.hooks.js";
import { masterProductionScheduleColumns } from "../columns/master-production-schedule-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MasterProductionScheduleListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useMasterProductionScheduleList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Master Production Schedule</h1>
        <Button onClick={() => router.push("/master-production-schedule/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={masterProductionScheduleColumns}
              data={data}
              onRowClick={(row) => router.push(`/master-production-schedule/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}