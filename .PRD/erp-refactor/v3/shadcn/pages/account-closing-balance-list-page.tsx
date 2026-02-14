"use client";

// List page for Account Closing Balance
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAccountClosingBalanceList } from "../hooks/account-closing-balance.hooks.js";
import { accountClosingBalanceColumns } from "../columns/account-closing-balance-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AccountClosingBalanceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAccountClosingBalanceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Account Closing Balance</h1>
        <Button onClick={() => router.push("/account-closing-balance/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={accountClosingBalanceColumns}
              data={data}
              onRowClick={(row) => router.push(`/account-closing-balance/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}