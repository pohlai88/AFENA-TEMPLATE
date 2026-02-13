"use client";

// List page for Supplier Group
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSupplierGroupList } from "../hooks/supplier-group.hooks.js";
import { supplierGroupColumns } from "../columns/supplier-group-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SupplierGroupListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSupplierGroupList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Supplier Group</h1>
        <Button onClick={() => router.push("/supplier-group/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={supplierGroupColumns}
              data={data}
              onRowClick={(row) => router.push(`/supplier-group/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}