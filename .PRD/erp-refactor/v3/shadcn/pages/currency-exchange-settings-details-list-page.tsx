"use client";

// List page for Currency Exchange Settings Details
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCurrencyExchangeSettingsDetailsList } from "../hooks/currency-exchange-settings-details.hooks.js";
import { currencyExchangeSettingsDetailsColumns } from "../columns/currency-exchange-settings-details-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CurrencyExchangeSettingsDetailsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCurrencyExchangeSettingsDetailsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Currency Exchange Settings Details</h1>
        <Button onClick={() => router.push("/currency-exchange-settings-details/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={currencyExchangeSettingsDetailsColumns}
              data={data}
              onRowClick={(row) => router.push(`/currency-exchange-settings-details/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}