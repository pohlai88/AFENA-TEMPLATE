"use client";

// List page for Supplier Scorecard Scoring Standing
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSupplierScorecardScoringStandingList } from "../hooks/supplier-scorecard-scoring-standing.hooks.js";
import { supplierScorecardScoringStandingColumns } from "../columns/supplier-scorecard-scoring-standing-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SupplierScorecardScoringStandingListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSupplierScorecardScoringStandingList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Supplier Scorecard Scoring Standing</h1>
        <Button onClick={() => router.push("/supplier-scorecard-scoring-standing/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={supplierScorecardScoringStandingColumns}
              data={data}
              onRowClick={(row) => router.push(`/supplier-scorecard-scoring-standing/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}