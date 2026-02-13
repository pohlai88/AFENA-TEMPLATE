"use client";

// List page for Pegged Currency Details
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePeggedCurrencyDetailsList } from "../hooks/pegged-currency-details.hooks.js";
import { peggedCurrencyDetailsColumns } from "../columns/pegged-currency-details-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PeggedCurrencyDetailsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePeggedCurrencyDetailsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Pegged Currency Details</h1>
        <Button onClick={() => router.push("/pegged-currency-details/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={peggedCurrencyDetailsColumns}
              data={data}
              onRowClick={(row) => router.push(`/pegged-currency-details/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}