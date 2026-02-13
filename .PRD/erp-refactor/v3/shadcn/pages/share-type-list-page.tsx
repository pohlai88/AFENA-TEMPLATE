"use client";

// List page for Share Type
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useShareTypeList } from "../hooks/share-type.hooks.js";
import { shareTypeColumns } from "../columns/share-type-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ShareTypeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useShareTypeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Share Type</h1>
        <Button onClick={() => router.push("/share-type/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={shareTypeColumns}
              data={data}
              onRowClick={(row) => router.push(`/share-type/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}