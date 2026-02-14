"use client";

// List page for Bank Clearance Detail
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBankClearanceDetailList } from "../hooks/bank-clearance-detail.hooks.js";
import { bankClearanceDetailColumns } from "../columns/bank-clearance-detail-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BankClearanceDetailListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBankClearanceDetailList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bank Clearance Detail</h1>
        <Button onClick={() => router.push("/bank-clearance-detail/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bankClearanceDetailColumns}
              data={data}
              onRowClick={(row) => router.push(`/bank-clearance-detail/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}