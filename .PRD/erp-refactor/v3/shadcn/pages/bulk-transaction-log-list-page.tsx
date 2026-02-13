"use client";

// List page for Bulk Transaction Log
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBulkTransactionLogList } from "../hooks/bulk-transaction-log.hooks.js";
import { bulkTransactionLogColumns } from "../columns/bulk-transaction-log-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BulkTransactionLogListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBulkTransactionLogList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bulk Transaction Log</h1>
        <Button onClick={() => router.push("/bulk-transaction-log/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bulkTransactionLogColumns}
              data={data}
              onRowClick={(row) => router.push(`/bulk-transaction-log/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}