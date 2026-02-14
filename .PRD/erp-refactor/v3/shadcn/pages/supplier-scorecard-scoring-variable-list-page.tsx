"use client";

// List page for Supplier Scorecard Scoring Variable
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSupplierScorecardScoringVariableList } from "../hooks/supplier-scorecard-scoring-variable.hooks.js";
import { supplierScorecardScoringVariableColumns } from "../columns/supplier-scorecard-scoring-variable-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SupplierScorecardScoringVariableListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSupplierScorecardScoringVariableList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Supplier Scorecard Scoring Variable</h1>
        <Button onClick={() => router.push("/supplier-scorecard-scoring-variable/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={supplierScorecardScoringVariableColumns}
              data={data}
              onRowClick={(row) => router.push(`/supplier-scorecard-scoring-variable/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}