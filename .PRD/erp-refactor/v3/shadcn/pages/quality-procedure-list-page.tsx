"use client";

// List page for Quality Procedure
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQualityProcedureList } from "../hooks/quality-procedure.hooks.js";
import { qualityProcedureColumns } from "../columns/quality-procedure-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QualityProcedureListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQualityProcedureList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quality Procedure</h1>
        <Button onClick={() => router.push("/quality-procedure/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={qualityProcedureColumns}
              data={data}
              onRowClick={(row) => router.push(`/quality-procedure/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}