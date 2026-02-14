"use client";

// List page for BOM Website Operation
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBomWebsiteOperationList } from "../hooks/bom-website-operation.hooks.js";
import { bomWebsiteOperationColumns } from "../columns/bom-website-operation-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BomWebsiteOperationListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBomWebsiteOperationList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">BOM Website Operation</h1>
        <Button onClick={() => router.push("/bom-website-operation/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={bomWebsiteOperationColumns}
              data={data}
              onRowClick={(row) => router.push(`/bom-website-operation/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}