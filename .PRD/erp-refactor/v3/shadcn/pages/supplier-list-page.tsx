"use client";

// List page for Supplier
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSupplierList } from "../hooks/supplier.hooks.js";
import { supplierColumns } from "../columns/supplier-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SupplierListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSupplierList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Supplier</h1>
        <Button onClick={() => router.push("/supplier/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={supplierColumns}
              data={data}
              onRowClick={(row) => router.push(`/supplier/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}