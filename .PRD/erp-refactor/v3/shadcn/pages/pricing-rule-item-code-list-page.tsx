"use client";

// List page for Pricing Rule Item Code
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePricingRuleItemCodeList } from "../hooks/pricing-rule-item-code.hooks.js";
import { pricingRuleItemCodeColumns } from "../columns/pricing-rule-item-code-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PricingRuleItemCodeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePricingRuleItemCodeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Pricing Rule Item Code</h1>
        <Button onClick={() => router.push("/pricing-rule-item-code/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={pricingRuleItemCodeColumns}
              data={data}
              onRowClick={(row) => router.push(`/pricing-rule-item-code/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}