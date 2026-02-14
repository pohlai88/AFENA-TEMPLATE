"use client";

// List page for Item Supplier
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useItemSupplierList } from "../hooks/item-supplier.hooks.js";
import { itemSupplierColumns } from "../columns/item-supplier-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemSupplierListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useItemSupplierList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Item Supplier</h1>
        <Button onClick={() => router.push("/item-supplier/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={itemSupplierColumns}
              data={data}
              onRowClick={(row) => router.push(`/item-supplier/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}