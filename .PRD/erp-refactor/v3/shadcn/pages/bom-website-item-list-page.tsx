"use client";

// List page for BOM Website Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBomWebsiteItemList } from "../hooks/bom-website-item.hooks.js";
import { bomWebsiteItemColumns } from "../columns/bom-website-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BomWebsiteItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBomWebsiteItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">BOM Website Item</h1>
        <Button onClick={() => router.push("/bom-website-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bomWebsiteItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/bom-website-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}