"use client";

// List page for Pricing Rule Brand
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePricingRuleBrandList } from "../hooks/pricing-rule-brand.hooks.js";
import { pricingRuleBrandColumns } from "../columns/pricing-rule-brand-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PricingRuleBrandListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePricingRuleBrandList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Pricing Rule Brand</h1>
        <Button onClick={() => router.push("/pricing-rule-brand/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={pricingRuleBrandColumns}
              data={data}
              onRowClick={(row) => router.push(`/pricing-rule-brand/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}