"use client";

// List page for Warehouse Type
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useWarehouseTypeList } from "../hooks/warehouse-type.hooks.js";
import { warehouseTypeColumns } from "../columns/warehouse-type-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WarehouseTypeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useWarehouseTypeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Warehouse Type</h1>
        <Button onClick={() => router.push("/warehouse-type/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={warehouseTypeColumns}
              data={data}
              onRowClick={(row) => router.push(`/warehouse-type/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}