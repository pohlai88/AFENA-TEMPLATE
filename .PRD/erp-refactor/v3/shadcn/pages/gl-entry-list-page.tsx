"use client";

// List page for GL Entry
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useGlEntryList } from "../hooks/gl-entry.hooks.js";
import { glEntryColumns } from "../columns/gl-entry-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GlEntryListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useGlEntryList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">GL Entry</h1>
        <Button onClick={() => router.push("/gl-entry/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={glEntryColumns}
              data={data}
              onRowClick={(row) => router.push(`/gl-entry/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}