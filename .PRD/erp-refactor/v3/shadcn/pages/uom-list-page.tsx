"use client";

// List page for UOM
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useUomList } from "../hooks/uom.hooks.js";
import { uomColumns } from "../columns/uom-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UomListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useUomList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">UOM</h1>
        <Button onClick={() => router.push("/uom/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={uomColumns}
              data={data}
              onRowClick={(row) => router.push(`/uom/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}