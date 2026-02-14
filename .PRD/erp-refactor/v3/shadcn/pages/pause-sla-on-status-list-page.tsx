"use client";

// List page for Pause SLA On Status
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePauseSlaOnStatusList } from "../hooks/pause-sla-on-status.hooks.js";
import { pauseSlaOnStatusColumns } from "../columns/pause-sla-on-status-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PauseSlaOnStatusListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePauseSlaOnStatusList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Pause SLA On Status</h1>
        <Button onClick={() => router.push("/pause-sla-on-status/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={pauseSlaOnStatusColumns}
              data={data}
              onRowClick={(row) => router.push(`/pause-sla-on-status/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}