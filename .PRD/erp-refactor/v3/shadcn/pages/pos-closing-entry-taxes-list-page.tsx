"use client";

// List page for POS Closing Entry Taxes
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePosClosingEntryTaxesList } from "../hooks/pos-closing-entry-taxes.hooks.js";
import { posClosingEntryTaxesColumns } from "../columns/pos-closing-entry-taxes-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PosClosingEntryTaxesListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePosClosingEntryTaxesList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">POS Closing Entry Taxes</h1>
        <Button onClick={() => router.push("/pos-closing-entry-taxes/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={posClosingEntryTaxesColumns}
              data={data}
              onRowClick={(row) => router.push(`/pos-closing-entry-taxes/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}