"use client";

// List page for Coupon Code
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCouponCodeList } from "../hooks/coupon-code.hooks.js";
import { couponCodeColumns } from "../columns/coupon-code-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CouponCodeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCouponCodeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Coupon Code</h1>
        <Button onClick={() => router.push("/coupon-code/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={couponCodeColumns}
              data={data}
              onRowClick={(row) => router.push(`/coupon-code/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}