"use client";

// List page for Bisect Accounting Statements
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBisectAccountingStatementsList } from "../hooks/bisect-accounting-statements.hooks.js";
import { bisectAccountingStatementsColumns } from "../columns/bisect-accounting-statements-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BisectAccountingStatementsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBisectAccountingStatementsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bisect Accounting Statements</h1>
        <Button onClick={() => router.push("/bisect-accounting-statements/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bisectAccountingStatementsColumns}
              data={data}
              onRowClick={(row) => router.push(`/bisect-accounting-statements/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}