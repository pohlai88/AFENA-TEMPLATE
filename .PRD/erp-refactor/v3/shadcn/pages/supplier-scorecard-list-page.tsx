"use client";

// List page for Supplier Scorecard
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSupplierScorecardList } from "../hooks/supplier-scorecard.hooks.js";
import { supplierScorecardColumns } from "../columns/supplier-scorecard-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SupplierScorecardListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSupplierScorecardList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Supplier Scorecard</h1>
        <Button onClick={() => router.push("/supplier-scorecard/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={supplierScorecardColumns}
              data={data}
              onRowClick={(row) => router.push(`/supplier-scorecard/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}