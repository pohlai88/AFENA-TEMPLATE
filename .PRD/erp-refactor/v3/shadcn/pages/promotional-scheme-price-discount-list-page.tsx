"use client";

// List page for Promotional Scheme Price Discount
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePromotionalSchemePriceDiscountList } from "../hooks/promotional-scheme-price-discount.hooks.js";
import { promotionalSchemePriceDiscountColumns } from "../columns/promotional-scheme-price-discount-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PromotionalSchemePriceDiscountListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePromotionalSchemePriceDiscountList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Promotional Scheme Price Discount</h1>
        <Button onClick={() => router.push("/promotional-scheme-price-discount/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={promotionalSchemePriceDiscountColumns}
              data={data}
              onRowClick={(row) => router.push(`/promotional-scheme-price-discount/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}