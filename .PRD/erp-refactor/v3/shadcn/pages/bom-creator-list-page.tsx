"use client";

// List page for BOM Creator
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBomCreatorList } from "../hooks/bom-creator.hooks.js";
import { bomCreatorColumns } from "../columns/bom-creator-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BomCreatorListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBomCreatorList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">BOM Creator</h1>
        <Button onClick={() => router.push("/bom-creator/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bomCreatorColumns}
              data={data}
              onRowClick={(row) => router.push(`/bom-creator/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}