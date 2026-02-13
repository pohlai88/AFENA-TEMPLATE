"use client";

// List page for Bank Statement Import
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBankStatementImportList } from "../hooks/bank-statement-import.hooks.js";
import { bankStatementImportColumns } from "../columns/bank-statement-import-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BankStatementImportListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBankStatementImportList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bank Statement Import</h1>
        <Button onClick={() => router.push("/bank-statement-import/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bankStatementImportColumns}
              data={data}
              onRowClick={(row) => router.push(`/bank-statement-import/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}