"use client";

// List page for Transaction Deletion Record To Delete
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useTransactionDeletionRecordToDeleteList } from "../hooks/transaction-deletion-record-to-delete.hooks.js";
import { transactionDeletionRecordToDeleteColumns } from "../columns/transaction-deletion-record-to-delete-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TransactionDeletionRecordToDeleteListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useTransactionDeletionRecordToDeleteList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transaction Deletion Record To Delete</h1>
        <Button onClick={() => router.push("/transaction-deletion-record-to-delete/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={transactionDeletionRecordToDeleteColumns}
              data={data}
              onRowClick={(row) => router.push(`/transaction-deletion-record-to-delete/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}