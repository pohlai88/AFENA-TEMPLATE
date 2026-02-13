"use client";

// List page for POS Opening Entry Detail
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePosOpeningEntryDetailList } from "../hooks/pos-opening-entry-detail.hooks.js";
import { posOpeningEntryDetailColumns } from "../columns/pos-opening-entry-detail-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PosOpeningEntryDetailListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePosOpeningEntryDetailList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">POS Opening Entry Detail</h1>
        <Button onClick={() => router.push("/pos-opening-entry-detail/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={posOpeningEntryDetailColumns}
              data={data}
              onRowClick={(row) => router.push(`/pos-opening-entry-detail/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}