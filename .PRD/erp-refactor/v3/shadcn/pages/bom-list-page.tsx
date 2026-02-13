"use client";

// List page for BOM
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBomList } from "../hooks/bom.hooks.js";
import { bomColumns } from "../columns/bom-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BomListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBomList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">BOM</h1>
        <Button onClick={() => router.push("/bom/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bomColumns}
              data={data}
              onRowClick={(row) => router.push(`/bom/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}