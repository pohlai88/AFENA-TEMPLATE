"use client";

// List page for Warehouse
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useWarehouseList } from "../hooks/warehouse.hooks.js";
import { warehouseColumns } from "../columns/warehouse-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WarehouseListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useWarehouseList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Warehouse</h1>
        <Button onClick={() => router.push("/warehouse/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={warehouseColumns}
              data={data}
              onRowClick={(row) => router.push(`/warehouse/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}