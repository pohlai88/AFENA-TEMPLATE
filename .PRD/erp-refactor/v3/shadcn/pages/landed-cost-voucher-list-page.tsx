"use client";

// List page for Landed Cost Voucher
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useLandedCostVoucherList } from "../hooks/landed-cost-voucher.hooks.js";
import { landedCostVoucherColumns } from "../columns/landed-cost-voucher-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LandedCostVoucherListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useLandedCostVoucherList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Landed Cost Voucher</h1>
        <Button onClick={() => router.push("/landed-cost-voucher/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={landedCostVoucherColumns}
              data={data}
              onRowClick={(row) => router.push(`/landed-cost-voucher/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}