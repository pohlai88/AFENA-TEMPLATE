"use client";

// List page for BOM Operation
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBomOperationList } from "../hooks/bom-operation.hooks.js";
import { bomOperationColumns } from "../columns/bom-operation-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BomOperationListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBomOperationList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">BOM Operation</h1>
        <Button onClick={() => router.push("/bom-operation/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bomOperationColumns}
              data={data}
              onRowClick={(row) => router.push(`/bom-operation/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}