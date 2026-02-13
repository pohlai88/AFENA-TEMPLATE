"use client";

// List page for Competitor
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCompetitorList } from "../hooks/competitor.hooks.js";
import { competitorColumns } from "../columns/competitor-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CompetitorListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCompetitorList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Competitor</h1>
        <Button onClick={() => router.push("/competitor/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={competitorColumns}
              data={data}
              onRowClick={(row) => router.push(`/competitor/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}