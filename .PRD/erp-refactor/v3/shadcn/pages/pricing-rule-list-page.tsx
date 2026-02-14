"use client";

// List page for Pricing Rule
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePricingRuleList } from "../hooks/pricing-rule.hooks.js";
import { pricingRuleColumns } from "../columns/pricing-rule-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PricingRuleListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePricingRuleList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Pricing Rule</h1>
        <Button onClick={() => router.push("/pricing-rule/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={pricingRuleColumns}
              data={data}
              onRowClick={(row) => router.push(`/pricing-rule/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}