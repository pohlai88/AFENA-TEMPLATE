"use client";

// List page for Material Request
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useMaterialRequestList } from "../hooks/material-request.hooks.js";
import { materialRequestColumns } from "../columns/material-request-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MaterialRequestListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useMaterialRequestList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Material Request</h1>
        <Button onClick={() => router.push("/material-request/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={materialRequestColumns}
              data={data}
              onRowClick={(row) => router.push(`/material-request/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}