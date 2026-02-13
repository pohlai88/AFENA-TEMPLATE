"use client";

// List page for Repost Accounting Ledger
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useRepostAccountingLedgerList } from "../hooks/repost-accounting-ledger.hooks.js";
import { repostAccountingLedgerColumns } from "../columns/repost-accounting-ledger-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RepostAccountingLedgerListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useRepostAccountingLedgerList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Repost Accounting Ledger</h1>
        <Button onClick={() => router.push("/repost-accounting-ledger/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={repostAccountingLedgerColumns}
              data={data}
              onRowClick={(row) => router.push(`/repost-accounting-ledger/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}