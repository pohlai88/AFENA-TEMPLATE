"use client";

// List page for Period Closing Voucher
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePeriodClosingVoucherList } from "../hooks/period-closing-voucher.hooks.js";
import { periodClosingVoucherColumns } from "../columns/period-closing-voucher-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PeriodClosingVoucherListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePeriodClosingVoucherList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Period Closing Voucher</h1>
        <Button onClick={() => router.push("/period-closing-voucher/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={periodClosingVoucherColumns}
              data={data}
              onRowClick={(row) => router.push(`/period-closing-voucher/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}