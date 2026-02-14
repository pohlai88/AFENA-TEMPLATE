"use client";

// List page for Tax Withholding Rate
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useTaxWithholdingRateList } from "../hooks/tax-withholding-rate.hooks.js";
import { taxWithholdingRateColumns } from "../columns/tax-withholding-rate-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TaxWithholdingRateListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useTaxWithholdingRateList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tax Withholding Rate</h1>
        <Button onClick={() => router.push("/tax-withholding-rate/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={taxWithholdingRateColumns}
              data={data}
              onRowClick={(row) => router.push(`/tax-withholding-rate/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}