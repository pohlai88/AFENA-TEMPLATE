"use client";

// List page for Pick List Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePickListItemList } from "../hooks/pick-list-item.hooks.js";
import { pickListItemColumns } from "../columns/pick-list-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PickListItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePickListItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Pick List Item</h1>
        <Button onClick={() => router.push("/pick-list-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={pickListItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/pick-list-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}