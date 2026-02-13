"use client";

// List page for Exchange Rate Revaluation Account
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useExchangeRateRevaluationAccountList } from "../hooks/exchange-rate-revaluation-account.hooks.js";
import { exchangeRateRevaluationAccountColumns } from "../columns/exchange-rate-revaluation-account-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ExchangeRateRevaluationAccountListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useExchangeRateRevaluationAccountList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Exchange Rate Revaluation Account</h1>
        <Button onClick={() => router.push("/exchange-rate-revaluation-account/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={exchangeRateRevaluationAccountColumns}
              data={data}
              onRowClick={(row) => router.push(`/exchange-rate-revaluation-account/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}