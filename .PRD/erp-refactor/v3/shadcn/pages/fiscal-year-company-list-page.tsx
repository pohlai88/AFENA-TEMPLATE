"use client";

// List page for Fiscal Year Company
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useFiscalYearCompanyList } from "../hooks/fiscal-year-company.hooks.js";
import { fiscalYearCompanyColumns } from "../columns/fiscal-year-company-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FiscalYearCompanyListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useFiscalYearCompanyList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Fiscal Year Company</h1>
        <Button onClick={() => router.push("/fiscal-year-company/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={fiscalYearCompanyColumns}
              data={data}
              onRowClick={(row) => router.push(`/fiscal-year-company/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}