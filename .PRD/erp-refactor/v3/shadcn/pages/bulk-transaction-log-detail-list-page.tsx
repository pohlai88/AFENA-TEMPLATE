"use client";

// List page for Bulk Transaction Log Detail
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBulkTransactionLogDetailList } from "../hooks/bulk-transaction-log-detail.hooks.js";
import { bulkTransactionLogDetailColumns } from "../columns/bulk-transaction-log-detail-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BulkTransactionLogDetailListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBulkTransactionLogDetailList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bulk Transaction Log Detail</h1>
        <Button onClick={() => router.push("/bulk-transaction-log-detail/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bulkTransactionLogDetailColumns}
              data={data}
              onRowClick={(row) => router.push(`/bulk-transaction-log-detail/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}