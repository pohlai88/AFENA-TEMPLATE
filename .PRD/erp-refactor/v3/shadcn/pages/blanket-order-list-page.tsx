"use client";

// List page for Blanket Order
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBlanketOrderList } from "../hooks/blanket-order.hooks.js";
import { blanketOrderColumns } from "../columns/blanket-order-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BlanketOrderListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBlanketOrderList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Blanket Order</h1>
        <Button onClick={() => router.push("/blanket-order/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={blanketOrderColumns}
              data={data}
              onRowClick={(row) => router.push(`/blanket-order/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}