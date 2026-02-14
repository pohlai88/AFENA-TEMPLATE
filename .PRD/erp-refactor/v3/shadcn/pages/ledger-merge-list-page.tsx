"use client";

// List page for Ledger Merge
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useLedgerMergeList } from "../hooks/ledger-merge.hooks.js";
import { ledgerMergeColumns } from "../columns/ledger-merge-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LedgerMergeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useLedgerMergeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Ledger Merge</h1>
        <Button onClick={() => router.push("/ledger-merge/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={ledgerMergeColumns}
              data={data}
              onRowClick={(row) => router.push(`/ledger-merge/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}