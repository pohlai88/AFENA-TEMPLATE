"use client";

// List page for Maintenance Visit Purpose
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useMaintenanceVisitPurposeList } from "../hooks/maintenance-visit-purpose.hooks.js";
import { maintenanceVisitPurposeColumns } from "../columns/maintenance-visit-purpose-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MaintenanceVisitPurposeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useMaintenanceVisitPurposeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Maintenance Visit Purpose</h1>
        <Button onClick={() => router.push("/maintenance-visit-purpose/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={maintenanceVisitPurposeColumns}
              data={data}
              onRowClick={(row) => router.push(`/maintenance-visit-purpose/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}