"use client";

// List page for BOM Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBomItemList } from "../hooks/bom-item.hooks.js";
import { bomItemColumns } from "../columns/bom-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BomItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBomItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">BOM Item</h1>
        <Button onClick={() => router.push("/bom-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bomItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/bom-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}