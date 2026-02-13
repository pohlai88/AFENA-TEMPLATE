"use client";

// List page for Chart of Accounts Importer
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useChartOfAccountsImporterList } from "../hooks/chart-of-accounts-importer.hooks.js";
import { chartOfAccountsImporterColumns } from "../columns/chart-of-accounts-importer-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChartOfAccountsImporterListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useChartOfAccountsImporterList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Chart of Accounts Importer</h1>
        <Button onClick={() => router.push("/chart-of-accounts-importer/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={chartOfAccountsImporterColumns}
              data={data}
              onRowClick={(row) => router.push(`/chart-of-accounts-importer/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}