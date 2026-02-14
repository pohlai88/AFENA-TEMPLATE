"use client";

// List page for Bank Transaction Mapping
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBankTransactionMappingList } from "../hooks/bank-transaction-mapping.hooks.js";
import { bankTransactionMappingColumns } from "../columns/bank-transaction-mapping-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BankTransactionMappingListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBankTransactionMappingList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bank Transaction Mapping</h1>
        <Button onClick={() => router.push("/bank-transaction-mapping/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bankTransactionMappingColumns}
              data={data}
              onRowClick={(row) => router.push(`/bank-transaction-mapping/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}