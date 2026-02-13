"use client";

// List page for Quality Inspection Template
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQualityInspectionTemplateList } from "../hooks/quality-inspection-template.hooks.js";
import { qualityInspectionTemplateColumns } from "../columns/quality-inspection-template-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QualityInspectionTemplateListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQualityInspectionTemplateList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quality Inspection Template</h1>
        <Button onClick={() => router.push("/quality-inspection-template/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={qualityInspectionTemplateColumns}
              data={data}
              onRowClick={(row) => router.push(`/quality-inspection-template/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}