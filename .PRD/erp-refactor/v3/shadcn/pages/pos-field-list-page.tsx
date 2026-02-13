"use client";

// List page for POS Field
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePosFieldList } from "../hooks/pos-field.hooks.js";
import { posFieldColumns } from "../columns/pos-field-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PosFieldListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePosFieldList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">POS Field</h1>
        <Button onClick={() => router.push("/pos-field/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={posFieldColumns}
              data={data}
              onRowClick={(row) => router.push(`/pos-field/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}