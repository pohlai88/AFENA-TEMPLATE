"use client";

// List page for Supplier Scorecard Scoring Criteria
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSupplierScorecardScoringCriteriaList } from "../hooks/supplier-scorecard-scoring-criteria.hooks.js";
import { supplierScorecardScoringCriteriaColumns } from "../columns/supplier-scorecard-scoring-criteria-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SupplierScorecardScoringCriteriaListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSupplierScorecardScoringCriteriaList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Supplier Scorecard Scoring Criteria</h1>
        <Button onClick={() => router.push("/supplier-scorecard-scoring-criteria/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={supplierScorecardScoringCriteriaColumns}
              data={data}
              onRowClick={(row) => router.push(`/supplier-scorecard-scoring-criteria/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}