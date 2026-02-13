"use client";

// List page for Repost Accounting Ledger Items
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useRepostAccountingLedgerItemsList } from "../hooks/repost-accounting-ledger-items.hooks.js";
import { repostAccountingLedgerItemsColumns } from "../columns/repost-accounting-ledger-items-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RepostAccountingLedgerItemsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useRepostAccountingLedgerItemsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Repost Accounting Ledger Items</h1>
        <Button onClick={() => router.push("/repost-accounting-ledger-items/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={repostAccountingLedgerItemsColumns}
              data={data}
              onRowClick={(row) => router.push(`/repost-accounting-ledger-items/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}