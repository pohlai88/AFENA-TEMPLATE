"use client";

// List page for Item Group
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useItemGroupList } from "../hooks/item-group.hooks.js";
import { itemGroupColumns } from "../columns/item-group-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemGroupListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useItemGroupList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Item Group</h1>
        <Button onClick={() => router.push("/item-group/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={itemGroupColumns}
              data={data}
              onRowClick={(row) => router.push(`/item-group/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}