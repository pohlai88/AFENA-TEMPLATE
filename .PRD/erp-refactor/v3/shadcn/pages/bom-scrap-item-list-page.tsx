"use client";

// List page for BOM Scrap Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBomScrapItemList } from "../hooks/bom-scrap-item.hooks.js";
import { bomScrapItemColumns } from "../columns/bom-scrap-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BomScrapItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBomScrapItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">BOM Scrap Item</h1>
        <Button onClick={() => router.push("/bom-scrap-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bomScrapItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/bom-scrap-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}