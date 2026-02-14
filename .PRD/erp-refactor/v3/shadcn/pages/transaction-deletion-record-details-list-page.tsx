"use client";

// List page for Transaction Deletion Record Details
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useTransactionDeletionRecordDetailsList } from "../hooks/transaction-deletion-record-details.hooks.js";
import { transactionDeletionRecordDetailsColumns } from "../columns/transaction-deletion-record-details-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TransactionDeletionRecordDetailsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useTransactionDeletionRecordDetailsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transaction Deletion Record Details</h1>
        <Button onClick={() => router.push("/transaction-deletion-record-details/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={transactionDeletionRecordDetailsColumns}
              data={data}
              onRowClick={(row) => router.push(`/transaction-deletion-record-details/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}