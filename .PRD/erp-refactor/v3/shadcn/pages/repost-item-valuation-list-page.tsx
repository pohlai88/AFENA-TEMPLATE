"use client";

// List page for Repost Item Valuation
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useRepostItemValuationList } from "../hooks/repost-item-valuation.hooks.js";
import { repostItemValuationColumns } from "../columns/repost-item-valuation-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RepostItemValuationListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useRepostItemValuationList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Repost Item Valuation</h1>
        <Button onClick={() => router.push("/repost-item-valuation/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={repostItemValuationColumns}
              data={data}
              onRowClick={(row) => router.push(`/repost-item-valuation/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}