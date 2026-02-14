"use client";

// List page for Transaction Deletion Record
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useTransactionDeletionRecordList } from "../hooks/transaction-deletion-record.hooks.js";
import { transactionDeletionRecordColumns } from "../columns/transaction-deletion-record-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TransactionDeletionRecordListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useTransactionDeletionRecordList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transaction Deletion Record</h1>
        <Button onClick={() => router.push("/transaction-deletion-record/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={transactionDeletionRecordColumns}
              data={data}
              onRowClick={(row) => router.push(`/transaction-deletion-record/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}