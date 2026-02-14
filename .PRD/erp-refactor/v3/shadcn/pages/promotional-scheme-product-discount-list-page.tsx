"use client";

// List page for Promotional Scheme Product Discount
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePromotionalSchemeProductDiscountList } from "../hooks/promotional-scheme-product-discount.hooks.js";
import { promotionalSchemeProductDiscountColumns } from "../columns/promotional-scheme-product-discount-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PromotionalSchemeProductDiscountListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePromotionalSchemeProductDiscountList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Promotional Scheme Product Discount</h1>
        <Button onClick={() => router.push("/promotional-scheme-product-discount/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={promotionalSchemeProductDiscountColumns}
              data={data}
              onRowClick={(row) => router.push(`/promotional-scheme-product-discount/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}