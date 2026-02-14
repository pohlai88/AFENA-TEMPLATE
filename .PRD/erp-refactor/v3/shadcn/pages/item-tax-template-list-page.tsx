"use client";

// List page for Item Tax Template
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useItemTaxTemplateList } from "../hooks/item-tax-template.hooks.js";
import { itemTaxTemplateColumns } from "../columns/item-tax-template-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemTaxTemplateListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useItemTaxTemplateList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Item Tax Template</h1>
        <Button onClick={() => router.push("/item-tax-template/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={itemTaxTemplateColumns}
              data={data}
              onRowClick={(row) => router.push(`/item-tax-template/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}