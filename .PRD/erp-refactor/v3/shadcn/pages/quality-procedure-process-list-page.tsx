"use client";

// List page for Quality Procedure Process
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQualityProcedureProcessList } from "../hooks/quality-procedure-process.hooks.js";
import { qualityProcedureProcessColumns } from "../columns/quality-procedure-process-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QualityProcedureProcessListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQualityProcedureProcessList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quality Procedure Process</h1>
        <Button onClick={() => router.push("/quality-procedure-process/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={qualityProcedureProcessColumns}
              data={data}
              onRowClick={(row) => router.push(`/quality-procedure-process/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}