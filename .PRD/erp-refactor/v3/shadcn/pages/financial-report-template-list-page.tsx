"use client";

// List page for Financial Report Template
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useFinancialReportTemplateList } from "../hooks/financial-report-template.hooks.js";
import { financialReportTemplateColumns } from "../columns/financial-report-template-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FinancialReportTemplateListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useFinancialReportTemplateList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Financial Report Template</h1>
        <Button onClick={() => router.push("/financial-report-template/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={financialReportTemplateColumns}
              data={data}
              onRowClick={(row) => router.push(`/financial-report-template/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}