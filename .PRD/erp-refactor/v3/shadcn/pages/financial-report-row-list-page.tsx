"use client";

// List page for Financial Report Row
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useFinancialReportRowList } from "../hooks/financial-report-row.hooks.js";
import { financialReportRowColumns } from "../columns/financial-report-row-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FinancialReportRowListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useFinancialReportRowList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Financial Report Row</h1>
        <Button onClick={() => router.push("/financial-report-row/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={financialReportRowColumns}
              data={data}
              onRowClick={(row) => router.push(`/financial-report-row/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}