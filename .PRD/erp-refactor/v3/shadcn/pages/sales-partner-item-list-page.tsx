"use client";

// List page for Sales Partner Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSalesPartnerItemList } from "../hooks/sales-partner-item.hooks.js";
import { salesPartnerItemColumns } from "../columns/sales-partner-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SalesPartnerItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSalesPartnerItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales Partner Item</h1>
        <Button onClick={() => router.push("/sales-partner-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={salesPartnerItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/sales-partner-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}