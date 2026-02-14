"use client";

// List page for Repost Payment Ledger Items
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useRepostPaymentLedgerItemsList } from "../hooks/repost-payment-ledger-items.hooks.js";
import { repostPaymentLedgerItemsColumns } from "../columns/repost-payment-ledger-items-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RepostPaymentLedgerItemsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useRepostPaymentLedgerItemsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Repost Payment Ledger Items</h1>
        <Button onClick={() => router.push("/repost-payment-ledger-items/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={repostPaymentLedgerItemsColumns}
              data={data}
              onRowClick={(row) => router.push(`/repost-payment-ledger-items/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}