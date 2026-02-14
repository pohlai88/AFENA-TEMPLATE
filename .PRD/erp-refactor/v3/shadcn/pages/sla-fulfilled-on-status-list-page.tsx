"use client";

// List page for SLA Fulfilled On Status
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSlaFulfilledOnStatusList } from "../hooks/sla-fulfilled-on-status.hooks.js";
import { slaFulfilledOnStatusColumns } from "../columns/sla-fulfilled-on-status-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SlaFulfilledOnStatusListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSlaFulfilledOnStatusList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">SLA Fulfilled On Status</h1>
        <Button onClick={() => router.push("/sla-fulfilled-on-status/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={slaFulfilledOnStatusColumns}
              data={data}
              onRowClick={(row) => router.push(`/sla-fulfilled-on-status/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}