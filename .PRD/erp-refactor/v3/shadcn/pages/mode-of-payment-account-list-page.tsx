"use client";

// List page for Mode of Payment Account
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useModeOfPaymentAccountList } from "../hooks/mode-of-payment-account.hooks.js";
import { modeOfPaymentAccountColumns } from "../columns/mode-of-payment-account-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ModeOfPaymentAccountListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useModeOfPaymentAccountList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Mode of Payment Account</h1>
        <Button onClick={() => router.push("/mode-of-payment-account/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={modeOfPaymentAccountColumns}
              data={data}
              onRowClick={(row) => router.push(`/mode-of-payment-account/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}