"use client";

// List page for UOM Conversion Factor
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useUomConversionFactorList } from "../hooks/uom-conversion-factor.hooks.js";
import { uomConversionFactorColumns } from "../columns/uom-conversion-factor-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UomConversionFactorListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useUomConversionFactorList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">UOM Conversion Factor</h1>
        <Button onClick={() => router.push("/uom-conversion-factor/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={uomConversionFactorColumns}
              data={data}
              onRowClick={(row) => router.push(`/uom-conversion-factor/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}