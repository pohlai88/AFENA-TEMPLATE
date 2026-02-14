"use client";

// List page for Supplier Scorecard Criteria
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSupplierScorecardCriteriaList } from "../hooks/supplier-scorecard-criteria.hooks.js";
import { supplierScorecardCriteriaColumns } from "../columns/supplier-scorecard-criteria-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SupplierScorecardCriteriaListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSupplierScorecardCriteriaList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Supplier Scorecard Criteria</h1>
        <Button onClick={() => router.push("/supplier-scorecard-criteria/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={supplierScorecardCriteriaColumns}
              data={data}
              onRowClick={(row) => router.push(`/supplier-scorecard-criteria/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}