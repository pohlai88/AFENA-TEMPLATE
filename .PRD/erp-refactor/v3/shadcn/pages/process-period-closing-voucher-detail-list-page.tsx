"use client";

// List page for Process Period Closing Voucher Detail
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProcessPeriodClosingVoucherDetailList } from "../hooks/process-period-closing-voucher-detail.hooks.js";
import { processPeriodClosingVoucherDetailColumns } from "../columns/process-period-closing-voucher-detail-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProcessPeriodClosingVoucherDetailListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProcessPeriodClosingVoucherDetailList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Process Period Closing Voucher Detail</h1>
        <Button onClick={() => router.push("/process-period-closing-voucher-detail/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={processPeriodClosingVoucherDetailColumns}
              data={data}
              onRowClick={(row) => router.push(`/process-period-closing-voucher-detail/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}