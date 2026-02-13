"use client";

// List page for Process Deferred Accounting
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProcessDeferredAccountingList } from "../hooks/process-deferred-accounting.hooks.js";
import { processDeferredAccountingColumns } from "../columns/process-deferred-accounting-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProcessDeferredAccountingListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProcessDeferredAccountingList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Process Deferred Accounting</h1>
        <Button onClick={() => router.push("/process-deferred-accounting/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={processDeferredAccountingColumns}
              data={data}
              onRowClick={(row) => router.push(`/process-deferred-accounting/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}