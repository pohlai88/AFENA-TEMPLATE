"use client";

// List page for Landed Cost Taxes and Charges
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useLandedCostTaxesAndChargesList } from "../hooks/landed-cost-taxes-and-charges.hooks.js";
import { landedCostTaxesAndChargesColumns } from "../columns/landed-cost-taxes-and-charges-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LandedCostTaxesAndChargesListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useLandedCostTaxesAndChargesList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Landed Cost Taxes and Charges</h1>
        <Button onClick={() => router.push("/landed-cost-taxes-and-charges/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={landedCostTaxesAndChargesColumns}
              data={data}
              onRowClick={(row) => router.push(`/landed-cost-taxes-and-charges/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}