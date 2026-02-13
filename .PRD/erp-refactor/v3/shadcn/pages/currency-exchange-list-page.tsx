"use client";

// List page for Currency Exchange
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCurrencyExchangeList } from "../hooks/currency-exchange.hooks.js";
import { currencyExchangeColumns } from "../columns/currency-exchange-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CurrencyExchangeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCurrencyExchangeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Currency Exchange</h1>
        <Button onClick={() => router.push("/currency-exchange/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={currencyExchangeColumns}
              data={data}
              onRowClick={(row) => router.push(`/currency-exchange/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}