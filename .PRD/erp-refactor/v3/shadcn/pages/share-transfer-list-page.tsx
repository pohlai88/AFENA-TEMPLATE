"use client";

// List page for Share Transfer
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useShareTransferList } from "../hooks/share-transfer.hooks.js";
import { shareTransferColumns } from "../columns/share-transfer-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ShareTransferListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useShareTransferList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Share Transfer</h1>
        <Button onClick={() => router.push("/share-transfer/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={shareTransferColumns}
              data={data}
              onRowClick={(row) => router.push(`/share-transfer/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}