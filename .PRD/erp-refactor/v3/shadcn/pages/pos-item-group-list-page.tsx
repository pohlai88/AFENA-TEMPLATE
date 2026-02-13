"use client";

// List page for POS Item Group
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePosItemGroupList } from "../hooks/pos-item-group.hooks.js";
import { posItemGroupColumns } from "../columns/pos-item-group-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PosItemGroupListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePosItemGroupList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">POS Item Group</h1>
        <Button onClick={() => router.push("/pos-item-group/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={posItemGroupColumns}
              data={data}
              onRowClick={(row) => router.push(`/pos-item-group/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}