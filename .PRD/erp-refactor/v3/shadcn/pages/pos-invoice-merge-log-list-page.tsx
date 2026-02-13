"use client";

// List page for POS Invoice Merge Log
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePosInvoiceMergeLogList } from "../hooks/pos-invoice-merge-log.hooks.js";
import { posInvoiceMergeLogColumns } from "../columns/pos-invoice-merge-log-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PosInvoiceMergeLogListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePosInvoiceMergeLogList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">POS Invoice Merge Log</h1>
        <Button onClick={() => router.push("/pos-invoice-merge-log/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={posInvoiceMergeLogColumns}
              data={data}
              onRowClick={(row) => router.push(`/pos-invoice-merge-log/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}