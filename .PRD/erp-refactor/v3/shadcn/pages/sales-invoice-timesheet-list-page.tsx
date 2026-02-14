"use client";

// List page for Sales Invoice Timesheet
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSalesInvoiceTimesheetList } from "../hooks/sales-invoice-timesheet.hooks.js";
import { salesInvoiceTimesheetColumns } from "../columns/sales-invoice-timesheet-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SalesInvoiceTimesheetListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSalesInvoiceTimesheetList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales Invoice Timesheet</h1>
        <Button onClick={() => router.push("/sales-invoice-timesheet/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={salesInvoiceTimesheetColumns}
              data={data}
              onRowClick={(row) => router.push(`/sales-invoice-timesheet/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}