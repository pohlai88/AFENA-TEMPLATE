"use client";

// List page for Competitor Detail
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCompetitorDetailList } from "../hooks/competitor-detail.hooks.js";
import { competitorDetailColumns } from "../columns/competitor-detail-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CompetitorDetailListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCompetitorDetailList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Competitor Detail</h1>
        <Button onClick={() => router.push("/competitor-detail/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={competitorDetailColumns}
              data={data}
              onRowClick={(row) => router.push(`/competitor-detail/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}