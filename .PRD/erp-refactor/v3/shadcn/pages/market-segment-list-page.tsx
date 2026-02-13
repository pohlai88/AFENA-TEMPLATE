"use client";

// List page for Market Segment
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useMarketSegmentList } from "../hooks/market-segment.hooks.js";
import { marketSegmentColumns } from "../columns/market-segment-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MarketSegmentListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useMarketSegmentList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Market Segment</h1>
        <Button onClick={() => router.push("/market-segment/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={marketSegmentColumns}
              data={data}
              onRowClick={(row) => router.push(`/market-segment/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}