"use client";

// List page for Item Default
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useItemDefaultList } from "../hooks/item-default.hooks.js";
import { itemDefaultColumns } from "../columns/item-default-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemDefaultListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useItemDefaultList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Item Default</h1>
        <Button onClick={() => router.push("/item-default/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={itemDefaultColumns}
              data={data}
              onRowClick={(row) => router.push(`/item-default/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}