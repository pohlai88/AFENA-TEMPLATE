"use client";

// List page for Rename Tool
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useRenameToolList } from "../hooks/rename-tool.hooks.js";
import { renameToolColumns } from "../columns/rename-tool-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RenameToolListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useRenameToolList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Rename Tool</h1>
        <Button onClick={() => router.push("/rename-tool/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={renameToolColumns}
              data={data}
              onRowClick={(row) => router.push(`/rename-tool/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}