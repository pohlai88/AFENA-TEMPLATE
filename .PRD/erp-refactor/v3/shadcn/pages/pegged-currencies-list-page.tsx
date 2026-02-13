"use client";

// List page for Pegged Currencies
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePeggedCurrenciesList } from "../hooks/pegged-currencies.hooks.js";
import { peggedCurrenciesColumns } from "../columns/pegged-currencies-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PeggedCurrenciesListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePeggedCurrenciesList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Pegged Currencies</h1>
        <Button onClick={() => router.push("/pegged-currencies/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={peggedCurrenciesColumns}
              data={data}
              onRowClick={(row) => router.push(`/pegged-currencies/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}