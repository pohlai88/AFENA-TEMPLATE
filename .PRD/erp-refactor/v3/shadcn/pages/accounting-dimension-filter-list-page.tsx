"use client";

// List page for Accounting Dimension Filter
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAccountingDimensionFilterList } from "../hooks/accounting-dimension-filter.hooks.js";
import { accountingDimensionFilterColumns } from "../columns/accounting-dimension-filter-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AccountingDimensionFilterListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAccountingDimensionFilterList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Accounting Dimension Filter</h1>
        <Button onClick={() => router.push("/accounting-dimension-filter/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={accountingDimensionFilterColumns}
              data={data}
              onRowClick={(row) => router.push(`/accounting-dimension-filter/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}