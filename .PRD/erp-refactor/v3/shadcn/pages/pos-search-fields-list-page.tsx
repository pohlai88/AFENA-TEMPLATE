"use client";

// List page for POS Search Fields
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePosSearchFieldsList } from "../hooks/pos-search-fields.hooks.js";
import { posSearchFieldsColumns } from "../columns/pos-search-fields-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PosSearchFieldsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePosSearchFieldsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">POS Search Fields</h1>
        <Button onClick={() => router.push("/pos-search-fields/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={posSearchFieldsColumns}
              data={data}
              onRowClick={(row) => router.push(`/pos-search-fields/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}