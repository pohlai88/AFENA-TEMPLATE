"use client";

// List page for Pricing Rule Detail
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePricingRuleDetailList } from "../hooks/pricing-rule-detail.hooks.js";
import { pricingRuleDetailColumns } from "../columns/pricing-rule-detail-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PricingRuleDetailListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePricingRuleDetailList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Pricing Rule Detail</h1>
        <Button onClick={() => router.push("/pricing-rule-detail/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={pricingRuleDetailColumns}
              data={data}
              onRowClick={(row) => router.push(`/pricing-rule-detail/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}