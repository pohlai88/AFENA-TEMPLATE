"use client";

// List page for Material Request Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useMaterialRequestItemList } from "../hooks/material-request-item.hooks.js";
import { materialRequestItemColumns } from "../columns/material-request-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MaterialRequestItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useMaterialRequestItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Material Request Item</h1>
        <Button onClick={() => router.push("/material-request-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={materialRequestItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/material-request-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}