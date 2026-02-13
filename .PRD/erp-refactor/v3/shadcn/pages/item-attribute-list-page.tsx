"use client";

// List page for Item Attribute
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useItemAttributeList } from "../hooks/item-attribute.hooks.js";
import { itemAttributeColumns } from "../columns/item-attribute-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemAttributeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useItemAttributeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Item Attribute</h1>
        <Button onClick={() => router.push("/item-attribute/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={itemAttributeColumns}
              data={data}
              onRowClick={(row) => router.push(`/item-attribute/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}