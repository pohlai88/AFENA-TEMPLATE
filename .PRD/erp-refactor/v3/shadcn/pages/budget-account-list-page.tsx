"use client";

// List page for Budget Account
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBudgetAccountList } from "../hooks/budget-account.hooks.js";
import { budgetAccountColumns } from "../columns/budget-account-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BudgetAccountListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBudgetAccountList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Budget Account</h1>
        <Button onClick={() => router.push("/budget-account/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={budgetAccountColumns}
              data={data}
              onRowClick={(row) => router.push(`/budget-account/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}