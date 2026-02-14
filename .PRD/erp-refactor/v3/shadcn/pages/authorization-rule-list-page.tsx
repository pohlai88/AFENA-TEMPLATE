"use client";

// List page for Authorization Rule
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAuthorizationRuleList } from "../hooks/authorization-rule.hooks.js";
import { authorizationRuleColumns } from "../columns/authorization-rule-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthorizationRuleListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAuthorizationRuleList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Authorization Rule</h1>
        <Button onClick={() => router.push("/authorization-rule/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={authorizationRuleColumns}
              data={data}
              onRowClick={(row) => router.push(`/authorization-rule/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}