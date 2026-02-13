"use client";

// List page for Supplier Scorecard Variable
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSupplierScorecardVariableList } from "../hooks/supplier-scorecard-variable.hooks.js";
import { supplierScorecardVariableColumns } from "../columns/supplier-scorecard-variable-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SupplierScorecardVariableListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSupplierScorecardVariableList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Supplier Scorecard Variable</h1>
        <Button onClick={() => router.push("/supplier-scorecard-variable/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={supplierScorecardVariableColumns}
              data={data}
              onRowClick={(row) => router.push(`/supplier-scorecard-variable/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}