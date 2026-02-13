"use client";

// List page for Bank Clearance
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBankClearanceList } from "../hooks/bank-clearance.hooks.js";
import { bankClearanceColumns } from "../columns/bank-clearance-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BankClearanceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBankClearanceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bank Clearance</h1>
        <Button onClick={() => router.push("/bank-clearance/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bankClearanceColumns}
              data={data}
              onRowClick={(row) => router.push(`/bank-clearance/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}