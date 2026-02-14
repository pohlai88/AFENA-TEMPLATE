"use client";

// List page for Supplier Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSupplierItemList } from "../hooks/supplier-item.hooks.js";
import { supplierItemColumns } from "../columns/supplier-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SupplierItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSupplierItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Supplier Item</h1>
        <Button onClick={() => router.push("/supplier-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={supplierItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/supplier-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}