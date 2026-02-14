"use client";

// List page for Repost Payment Ledger
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useRepostPaymentLedgerList } from "../hooks/repost-payment-ledger.hooks.js";
import { repostPaymentLedgerColumns } from "../columns/repost-payment-ledger-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RepostPaymentLedgerListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useRepostPaymentLedgerList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Repost Payment Ledger</h1>
        <Button onClick={() => router.push("/repost-payment-ledger/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={repostPaymentLedgerColumns}
              data={data}
              onRowClick={(row) => router.push(`/repost-payment-ledger/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}