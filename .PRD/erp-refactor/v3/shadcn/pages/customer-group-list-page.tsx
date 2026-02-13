"use client";

// List page for Customer Group
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCustomerGroupList } from "../hooks/customer-group.hooks.js";
import { customerGroupColumns } from "../columns/customer-group-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CustomerGroupListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCustomerGroupList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customer Group</h1>
        <Button onClick={() => router.push("/customer-group/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={customerGroupColumns}
              data={data}
              onRowClick={(row) => router.push(`/customer-group/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}