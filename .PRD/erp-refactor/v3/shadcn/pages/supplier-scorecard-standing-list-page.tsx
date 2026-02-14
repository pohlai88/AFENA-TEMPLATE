"use client";

// List page for Supplier Scorecard Standing
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSupplierScorecardStandingList } from "../hooks/supplier-scorecard-standing.hooks.js";
import { supplierScorecardStandingColumns } from "../columns/supplier-scorecard-standing-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SupplierScorecardStandingListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSupplierScorecardStandingList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Supplier Scorecard Standing</h1>
        <Button onClick={() => router.push("/supplier-scorecard-standing/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={supplierScorecardStandingColumns}
              data={data}
              onRowClick={(row) => router.push(`/supplier-scorecard-standing/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}