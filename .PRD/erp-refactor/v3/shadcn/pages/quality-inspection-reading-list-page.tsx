"use client";

// List page for Quality Inspection Reading
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQualityInspectionReadingList } from "../hooks/quality-inspection-reading.hooks.js";
import { qualityInspectionReadingColumns } from "../columns/quality-inspection-reading-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QualityInspectionReadingListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQualityInspectionReadingList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quality Inspection Reading</h1>
        <Button onClick={() => router.push("/quality-inspection-reading/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={qualityInspectionReadingColumns}
              data={data}
              onRowClick={(row) => router.push(`/quality-inspection-reading/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}