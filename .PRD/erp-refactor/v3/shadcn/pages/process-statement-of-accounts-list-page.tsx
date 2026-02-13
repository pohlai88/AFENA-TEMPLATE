"use client";

// List page for Process Statement Of Accounts
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProcessStatementOfAccountsList } from "../hooks/process-statement-of-accounts.hooks.js";
import { processStatementOfAccountsColumns } from "../columns/process-statement-of-accounts-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProcessStatementOfAccountsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProcessStatementOfAccountsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Process Statement Of Accounts</h1>
        <Button onClick={() => router.push("/process-statement-of-accounts/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={processStatementOfAccountsColumns}
              data={data}
              onRowClick={(row) => router.push(`/process-statement-of-accounts/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}