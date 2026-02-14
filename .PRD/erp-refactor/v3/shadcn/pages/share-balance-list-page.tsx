"use client";

// List page for Share Balance
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useShareBalanceList } from "../hooks/share-balance.hooks.js";
import { shareBalanceColumns } from "../columns/share-balance-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ShareBalanceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useShareBalanceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Share Balance</h1>
        <Button onClick={() => router.push("/share-balance/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={shareBalanceColumns}
              data={data}
              onRowClick={(row) => router.push(`/share-balance/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}