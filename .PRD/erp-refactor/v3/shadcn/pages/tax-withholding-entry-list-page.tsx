"use client";

// List page for Tax Withholding Entry
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useTaxWithholdingEntryList } from "../hooks/tax-withholding-entry.hooks.js";
import { taxWithholdingEntryColumns } from "../columns/tax-withholding-entry-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TaxWithholdingEntryListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useTaxWithholdingEntryList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tax Withholding Entry</h1>
        <Button onClick={() => router.push("/tax-withholding-entry/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={taxWithholdingEntryColumns}
              data={data}
              onRowClick={(row) => router.push(`/tax-withholding-entry/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}