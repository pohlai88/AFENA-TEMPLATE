"use client";

// List page for Tax Rule
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useTaxRuleList } from "../hooks/tax-rule.hooks.js";
import { taxRuleColumns } from "../columns/tax-rule-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TaxRuleListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useTaxRuleList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tax Rule</h1>
        <Button onClick={() => router.push("/tax-rule/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={taxRuleColumns}
              data={data}
              onRowClick={(row) => router.push(`/tax-rule/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}