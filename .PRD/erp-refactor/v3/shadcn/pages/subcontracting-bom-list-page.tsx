"use client";

// List page for Subcontracting BOM
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSubcontractingBomList } from "../hooks/subcontracting-bom.hooks.js";
import { subcontractingBomColumns } from "../columns/subcontracting-bom-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubcontractingBomListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSubcontractingBomList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Subcontracting BOM</h1>
        <Button onClick={() => router.push("/subcontracting-bom/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={subcontractingBomColumns}
              data={data}
              onRowClick={(row) => router.push(`/subcontracting-bom/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}