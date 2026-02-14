"use client";

// List page for Quality Action Resolution
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQualityActionResolutionList } from "../hooks/quality-action-resolution.hooks.js";
import { qualityActionResolutionColumns } from "../columns/quality-action-resolution-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QualityActionResolutionListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQualityActionResolutionList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quality Action Resolution</h1>
        <Button onClick={() => router.push("/quality-action-resolution/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={qualityActionResolutionColumns}
              data={data}
              onRowClick={(row) => router.push(`/quality-action-resolution/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}