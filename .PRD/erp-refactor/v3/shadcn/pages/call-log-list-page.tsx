"use client";

// List page for Call Log
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCallLogList } from "../hooks/call-log.hooks.js";
import { callLogColumns } from "../columns/call-log-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CallLogListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCallLogList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Call Log</h1>
        <Button onClick={() => router.push("/call-log/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={callLogColumns}
              data={data}
              onRowClick={(row) => router.push(`/call-log/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}