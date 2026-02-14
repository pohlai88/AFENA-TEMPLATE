"use client";

// List page for BOM Explosion Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBomExplosionItemList } from "../hooks/bom-explosion-item.hooks.js";
import { bomExplosionItemColumns } from "../columns/bom-explosion-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BomExplosionItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBomExplosionItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">BOM Explosion Item</h1>
        <Button onClick={() => router.push("/bom-explosion-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bomExplosionItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/bom-explosion-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}