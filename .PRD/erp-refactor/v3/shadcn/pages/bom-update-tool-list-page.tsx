"use client";

// List page for BOM Update Tool
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBomUpdateToolList } from "../hooks/bom-update-tool.hooks.js";
import { bomUpdateToolColumns } from "../columns/bom-update-tool-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BomUpdateToolListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBomUpdateToolList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">BOM Update Tool</h1>
        <Button onClick={() => router.push("/bom-update-tool/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bomUpdateToolColumns}
              data={data}
              onRowClick={(row) => router.push(`/bom-update-tool/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}