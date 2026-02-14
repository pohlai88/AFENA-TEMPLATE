"use client";

// List page for Quality Inspection
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQualityInspectionList } from "../hooks/quality-inspection.hooks.js";
import { qualityInspectionColumns } from "../columns/quality-inspection-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QualityInspectionListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQualityInspectionList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quality Inspection</h1>
        <Button onClick={() => router.push("/quality-inspection/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={qualityInspectionColumns}
              data={data}
              onRowClick={(row) => router.push(`/quality-inspection/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}