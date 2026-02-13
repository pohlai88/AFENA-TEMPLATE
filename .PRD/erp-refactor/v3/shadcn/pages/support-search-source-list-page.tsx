"use client";

// List page for Support Search Source
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSupportSearchSourceList } from "../hooks/support-search-source.hooks.js";
import { supportSearchSourceColumns } from "../columns/support-search-source-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SupportSearchSourceListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSupportSearchSourceList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Support Search Source</h1>
        <Button onClick={() => router.push("/support-search-source/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={supportSearchSourceColumns}
              data={data}
              onRowClick={(row) => router.push(`/support-search-source/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}