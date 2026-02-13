"use client";

// List page for Item Lead Time
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useItemLeadTimeList } from "../hooks/item-lead-time.hooks.js";
import { itemLeadTimeColumns } from "../columns/item-lead-time-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemLeadTimeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useItemLeadTimeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Item Lead Time</h1>
        <Button onClick={() => router.push("/item-lead-time/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={itemLeadTimeColumns}
              data={data}
              onRowClick={(row) => router.push(`/item-lead-time/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}