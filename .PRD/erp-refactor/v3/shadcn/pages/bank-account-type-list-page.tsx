"use client";

// List page for Bank Account Type
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBankAccountTypeList } from "../hooks/bank-account-type.hooks.js";
import { bankAccountTypeColumns } from "../columns/bank-account-type-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BankAccountTypeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBankAccountTypeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bank Account Type</h1>
        <Button onClick={() => router.push("/bank-account-type/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bankAccountTypeColumns}
              data={data}
              onRowClick={(row) => router.push(`/bank-account-type/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}