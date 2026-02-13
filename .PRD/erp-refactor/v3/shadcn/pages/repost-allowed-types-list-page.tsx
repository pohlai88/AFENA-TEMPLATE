"use client";

// List page for Repost Allowed Types
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useRepostAllowedTypesList } from "../hooks/repost-allowed-types.hooks.js";
import { repostAllowedTypesColumns } from "../columns/repost-allowed-types-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RepostAllowedTypesListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useRepostAllowedTypesList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Repost Allowed Types</h1>
        <Button onClick={() => router.push("/repost-allowed-types/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={repostAllowedTypesColumns}
              data={data}
              onRowClick={(row) => router.push(`/repost-allowed-types/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}