"use client";

// List page for Ledger Merge Accounts
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useLedgerMergeAccountsList } from "../hooks/ledger-merge-accounts.hooks.js";
import { ledgerMergeAccountsColumns } from "../columns/ledger-merge-accounts-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LedgerMergeAccountsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useLedgerMergeAccountsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Ledger Merge Accounts</h1>
        <Button onClick={() => router.push("/ledger-merge-accounts/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={ledgerMergeAccountsColumns}
              data={data}
              onRowClick={(row) => router.push(`/ledger-merge-accounts/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}