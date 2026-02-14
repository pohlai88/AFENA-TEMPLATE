"use client";

// List page for POS Closing Entry Detail
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePosClosingEntryDetailList } from "../hooks/pos-closing-entry-detail.hooks.js";
import { posClosingEntryDetailColumns } from "../columns/pos-closing-entry-detail-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PosClosingEntryDetailListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePosClosingEntryDetailList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">POS Closing Entry Detail</h1>
        <Button onClick={() => router.push("/pos-closing-entry-detail/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={posClosingEntryDetailColumns}
              data={data}
              onRowClick={(row) => router.push(`/pos-closing-entry-detail/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}