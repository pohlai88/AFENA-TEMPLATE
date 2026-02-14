"use client";

// List page for Customer
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCustomerList } from "../hooks/customer.hooks.js";
import { customerColumns } from "../columns/customer-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CustomerListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCustomerList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customer</h1>
        <Button onClick={() => router.push("/customer/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={customerColumns}
              data={data}
              onRowClick={(row) => router.push(`/customer/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}