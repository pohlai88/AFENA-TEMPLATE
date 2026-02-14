"use client";

// List page for Downtime Entry
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useDowntimeEntryList } from "../hooks/downtime-entry.hooks.js";
import { downtimeEntryColumns } from "../columns/downtime-entry-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DowntimeEntryListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useDowntimeEntryList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Downtime Entry</h1>
        <Button onClick={() => router.push("/downtime-entry/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={downtimeEntryColumns}
              data={data}
              onRowClick={(row) => router.push(`/downtime-entry/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}