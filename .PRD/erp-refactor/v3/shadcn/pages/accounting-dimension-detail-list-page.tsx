"use client";

// List page for Accounting Dimension Detail
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAccountingDimensionDetailList } from "../hooks/accounting-dimension-detail.hooks.js";
import { accountingDimensionDetailColumns } from "../columns/accounting-dimension-detail-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AccountingDimensionDetailListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAccountingDimensionDetailList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Accounting Dimension Detail</h1>
        <Button onClick={() => router.push("/accounting-dimension-detail/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={accountingDimensionDetailColumns}
              data={data}
              onRowClick={(row) => router.push(`/accounting-dimension-detail/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}