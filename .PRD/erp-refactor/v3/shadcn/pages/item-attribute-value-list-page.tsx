"use client";

// List page for Item Attribute Value
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useItemAttributeValueList } from "../hooks/item-attribute-value.hooks.js";
import { itemAttributeValueColumns } from "../columns/item-attribute-value-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemAttributeValueListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useItemAttributeValueList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Item Attribute Value</h1>
        <Button onClick={() => router.push("/item-attribute-value/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={itemAttributeValueColumns}
              data={data}
              onRowClick={(row) => router.push(`/item-attribute-value/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}