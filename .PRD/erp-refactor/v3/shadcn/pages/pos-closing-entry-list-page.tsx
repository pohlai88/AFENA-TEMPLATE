"use client";

// List page for POS Closing Entry
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePosClosingEntryList } from "../hooks/pos-closing-entry.hooks.js";
import { posClosingEntryColumns } from "../columns/pos-closing-entry-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PosClosingEntryListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePosClosingEntryList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">POS Closing Entry</h1>
        <Button onClick={() => router.push("/pos-closing-entry/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={posClosingEntryColumns}
              data={data}
              onRowClick={(row) => router.push(`/pos-closing-entry/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}