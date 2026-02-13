"use client";

// List page for Variant Field
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useVariantFieldList } from "../hooks/variant-field.hooks.js";
import { variantFieldColumns } from "../columns/variant-field-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VariantFieldListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useVariantFieldList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Variant Field</h1>
        <Button onClick={() => router.push("/variant-field/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={variantFieldColumns}
              data={data}
              onRowClick={(row) => router.push(`/variant-field/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}