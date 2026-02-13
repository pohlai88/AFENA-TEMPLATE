"use client";

// List page for Fiscal Year
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useFiscalYearList } from "../hooks/fiscal-year.hooks.js";
import { fiscalYearColumns } from "../columns/fiscal-year-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FiscalYearListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useFiscalYearList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Fiscal Year</h1>
        <Button onClick={() => router.push("/fiscal-year/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={fiscalYearColumns}
              data={data}
              onRowClick={(row) => router.push(`/fiscal-year/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}