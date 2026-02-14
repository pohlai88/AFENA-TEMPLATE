"use client";

// List page for UOM Conversion Detail
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useUomConversionDetailList } from "../hooks/uom-conversion-detail.hooks.js";
import { uomConversionDetailColumns } from "../columns/uom-conversion-detail-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UomConversionDetailListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useUomConversionDetailList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">UOM Conversion Detail</h1>
        <Button onClick={() => router.push("/uom-conversion-detail/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={uomConversionDetailColumns}
              data={data}
              onRowClick={(row) => router.push(`/uom-conversion-detail/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}