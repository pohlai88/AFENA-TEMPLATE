"use client";

// List page for Item Quality Inspection Parameter
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useItemQualityInspectionParameterList } from "../hooks/item-quality-inspection-parameter.hooks.js";
import { itemQualityInspectionParameterColumns } from "../columns/item-quality-inspection-parameter-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemQualityInspectionParameterListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useItemQualityInspectionParameterList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Item Quality Inspection Parameter</h1>
        <Button onClick={() => router.push("/item-quality-inspection-parameter/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={itemQualityInspectionParameterColumns}
              data={data}
              onRowClick={(row) => router.push(`/item-quality-inspection-parameter/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}