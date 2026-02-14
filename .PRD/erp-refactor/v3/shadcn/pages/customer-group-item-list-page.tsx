"use client";

// List page for Customer Group Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCustomerGroupItemList } from "../hooks/customer-group-item.hooks.js";
import { customerGroupItemColumns } from "../columns/customer-group-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CustomerGroupItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCustomerGroupItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customer Group Item</h1>
        <Button onClick={() => router.push("/customer-group-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={customerGroupItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/customer-group-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}