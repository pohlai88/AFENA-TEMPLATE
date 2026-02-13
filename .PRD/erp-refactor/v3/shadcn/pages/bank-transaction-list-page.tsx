"use client";

// List page for Bank Transaction
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBankTransactionList } from "../hooks/bank-transaction.hooks.js";
import { bankTransactionColumns } from "../columns/bank-transaction-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BankTransactionListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBankTransactionList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bank Transaction</h1>
        <Button onClick={() => router.push("/bank-transaction/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bankTransactionColumns}
              data={data}
              onRowClick={(row) => router.push(`/bank-transaction/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}