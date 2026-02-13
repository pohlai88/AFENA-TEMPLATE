"use client";

// List page for Pick List
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePickListList } from "../hooks/pick-list.hooks.js";
import { pickListColumns } from "../columns/pick-list-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PickListListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePickListList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Pick List</h1>
        <Button onClick={() => router.push("/pick-list/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={pickListColumns}
              data={data}
              onRowClick={(row) => router.push(`/pick-list/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}