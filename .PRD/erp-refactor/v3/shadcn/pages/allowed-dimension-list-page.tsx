"use client";

// List page for Allowed Dimension
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAllowedDimensionList } from "../hooks/allowed-dimension.hooks.js";
import { allowedDimensionColumns } from "../columns/allowed-dimension-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AllowedDimensionListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAllowedDimensionList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Allowed Dimension</h1>
        <Button onClick={() => router.push("/allowed-dimension/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={allowedDimensionColumns}
              data={data}
              onRowClick={(row) => router.push(`/allowed-dimension/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}