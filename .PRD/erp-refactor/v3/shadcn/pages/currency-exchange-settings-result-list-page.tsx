"use client";

// List page for Currency Exchange Settings Result
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCurrencyExchangeSettingsResultList } from "../hooks/currency-exchange-settings-result.hooks.js";
import { currencyExchangeSettingsResultColumns } from "../columns/currency-exchange-settings-result-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CurrencyExchangeSettingsResultListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCurrencyExchangeSettingsResultList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Currency Exchange Settings Result</h1>
        <Button onClick={() => router.push("/currency-exchange-settings-result/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={currencyExchangeSettingsResultColumns}
              data={data}
              onRowClick={(row) => router.push(`/currency-exchange-settings-result/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}