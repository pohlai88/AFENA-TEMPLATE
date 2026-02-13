"use client";

// List page for Pricing Rule Item Group
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePricingRuleItemGroupList } from "../hooks/pricing-rule-item-group.hooks.js";
import { pricingRuleItemGroupColumns } from "../columns/pricing-rule-item-group-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PricingRuleItemGroupListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePricingRuleItemGroupList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Pricing Rule Item Group</h1>
        <Button onClick={() => router.push("/pricing-rule-item-group/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={pricingRuleItemGroupColumns}
              data={data}
              onRowClick={(row) => router.push(`/pricing-rule-item-group/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}