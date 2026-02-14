"use client";

// List page for Quality Inspection Parameter
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQualityInspectionParameterList } from "../hooks/quality-inspection-parameter.hooks.js";
import { qualityInspectionParameterColumns } from "../columns/quality-inspection-parameter-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QualityInspectionParameterListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQualityInspectionParameterList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quality Inspection Parameter</h1>
        <Button onClick={() => router.push("/quality-inspection-parameter/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={qualityInspectionParameterColumns}
              data={data}
              onRowClick={(row) => router.push(`/quality-inspection-parameter/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}