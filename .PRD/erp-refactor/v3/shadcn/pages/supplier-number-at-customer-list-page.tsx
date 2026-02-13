"use client";

// List page for Supplier Number At Customer
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSupplierNumberAtCustomerList } from "../hooks/supplier-number-at-customer.hooks.js";
import { supplierNumberAtCustomerColumns } from "../columns/supplier-number-at-customer-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SupplierNumberAtCustomerListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSupplierNumberAtCustomerList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Supplier Number At Customer</h1>
        <Button onClick={() => router.push("/supplier-number-at-customer/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={supplierNumberAtCustomerColumns}
              data={data}
              onRowClick={(row) => router.push(`/supplier-number-at-customer/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}