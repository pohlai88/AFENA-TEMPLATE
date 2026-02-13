"use client";

// List page for Item Alternative
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useItemAlternativeList } from "../hooks/item-alternative.hooks.js";
import { itemAlternativeColumns } from "../columns/item-alternative-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemAlternativeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useItemAlternativeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Item Alternative</h1>
        <Button onClick={() => router.push("/item-alternative/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={itemAlternativeColumns}
              data={data}
              onRowClick={(row) => router.push(`/item-alternative/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}