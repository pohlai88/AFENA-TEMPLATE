"use client";

// List page for Service Day
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useServiceDayList } from "../hooks/service-day.hooks.js";
import { serviceDayColumns } from "../columns/service-day-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ServiceDayListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useServiceDayList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Service Day</h1>
        <Button onClick={() => router.push("/service-day/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={serviceDayColumns}
              data={data}
              onRowClick={(row) => router.push(`/service-day/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}