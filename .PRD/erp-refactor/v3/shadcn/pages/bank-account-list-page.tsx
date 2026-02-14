"use client";

// List page for Bank Account
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBankAccountList } from "../hooks/bank-account.hooks.js";
import { bankAccountColumns } from "../columns/bank-account-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BankAccountListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBankAccountList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bank Account</h1>
        <Button onClick={() => router.push("/bank-account/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bankAccountColumns}
              data={data}
              onRowClick={(row) => router.push(`/bank-account/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}