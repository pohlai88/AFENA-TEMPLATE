"use client";

// List page for Supplier Group Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSupplierGroupItemList } from "../hooks/supplier-group-item.hooks.js";
import { supplierGroupItemColumns } from "../columns/supplier-group-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SupplierGroupItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSupplierGroupItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Supplier Group Item</h1>
        <Button onClick={() => router.push("/supplier-group-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={supplierGroupItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/supplier-group-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}