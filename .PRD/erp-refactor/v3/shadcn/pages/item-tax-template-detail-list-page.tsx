"use client";

// List page for Item Tax Template Detail
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useItemTaxTemplateDetailList } from "../hooks/item-tax-template-detail.hooks.js";
import { itemTaxTemplateDetailColumns } from "../columns/item-tax-template-detail-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemTaxTemplateDetailListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useItemTaxTemplateDetailList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Item Tax Template Detail</h1>
        <Button onClick={() => router.push("/item-tax-template-detail/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={itemTaxTemplateDetailColumns}
              data={data}
              onRowClick={(row) => router.push(`/item-tax-template-detail/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}