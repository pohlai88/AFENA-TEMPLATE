"use client";

// List page for Putaway Rule
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePutawayRuleList } from "../hooks/putaway-rule.hooks.js";
import { putawayRuleColumns } from "../columns/putaway-rule-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PutawayRuleListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePutawayRuleList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Putaway Rule</h1>
        <Button onClick={() => router.push("/putaway-rule/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={putawayRuleColumns}
              data={data}
              onRowClick={(row) => router.push(`/putaway-rule/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}