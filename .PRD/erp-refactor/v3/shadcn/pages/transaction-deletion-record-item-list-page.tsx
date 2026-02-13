"use client";

// List page for Transaction Deletion Record Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useTransactionDeletionRecordItemList } from "../hooks/transaction-deletion-record-item.hooks.js";
import { transactionDeletionRecordItemColumns } from "../columns/transaction-deletion-record-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TransactionDeletionRecordItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useTransactionDeletionRecordItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transaction Deletion Record Item</h1>
        <Button onClick={() => router.push("/transaction-deletion-record-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={transactionDeletionRecordItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/transaction-deletion-record-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}