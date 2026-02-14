"use client";

// List page for Shipping Rule
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useShippingRuleList } from "../hooks/shipping-rule.hooks.js";
import { shippingRuleColumns } from "../columns/shipping-rule-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ShippingRuleListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useShippingRuleList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Shipping Rule</h1>
        <Button onClick={() => router.push("/shipping-rule/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={shippingRuleColumns}
              data={data}
              onRowClick={(row) => router.push(`/shipping-rule/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}