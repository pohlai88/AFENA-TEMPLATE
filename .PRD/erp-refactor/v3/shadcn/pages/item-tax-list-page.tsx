"use client";

// List page for Item Tax
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useItemTaxList } from "../hooks/item-tax.hooks.js";
import { itemTaxColumns } from "../columns/item-tax-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemTaxListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useItemTaxList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Item Tax</h1>
        <Button onClick={() => router.push("/item-tax/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={itemTaxColumns}
              data={data}
              onRowClick={(row) => router.push(`/item-tax/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}