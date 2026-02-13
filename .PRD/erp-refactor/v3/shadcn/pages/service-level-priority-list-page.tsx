"use client";

// List page for Service Level Priority
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useServiceLevelPriorityList } from "../hooks/service-level-priority.hooks.js";
import { serviceLevelPriorityColumns } from "../columns/service-level-priority-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ServiceLevelPriorityListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useServiceLevelPriorityList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Service Level Priority</h1>
        <Button onClick={() => router.push("/service-level-priority/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={serviceLevelPriorityColumns}
              data={data}
              onRowClick={(row) => router.push(`/service-level-priority/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}