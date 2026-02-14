"use client";

// List page for Maintenance Visit
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useMaintenanceVisitList } from "../hooks/maintenance-visit.hooks.js";
import { maintenanceVisitColumns } from "../columns/maintenance-visit-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MaintenanceVisitListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useMaintenanceVisitList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Maintenance Visit</h1>
        <Button onClick={() => router.push("/maintenance-visit/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={maintenanceVisitColumns}
              data={data}
              onRowClick={(row) => router.push(`/maintenance-visit/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}