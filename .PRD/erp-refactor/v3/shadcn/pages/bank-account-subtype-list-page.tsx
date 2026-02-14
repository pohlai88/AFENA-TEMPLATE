"use client";

// List page for Bank Account Subtype
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBankAccountSubtypeList } from "../hooks/bank-account-subtype.hooks.js";
import { bankAccountSubtypeColumns } from "../columns/bank-account-subtype-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BankAccountSubtypeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBankAccountSubtypeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bank Account Subtype</h1>
        <Button onClick={() => router.push("/bank-account-subtype/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bankAccountSubtypeColumns}
              data={data}
              onRowClick={(row) => router.push(`/bank-account-subtype/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}