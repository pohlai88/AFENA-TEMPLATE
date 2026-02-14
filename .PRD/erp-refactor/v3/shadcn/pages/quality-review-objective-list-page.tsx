"use client";

// List page for Quality Review Objective
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQualityReviewObjectiveList } from "../hooks/quality-review-objective.hooks.js";
import { qualityReviewObjectiveColumns } from "../columns/quality-review-objective-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QualityReviewObjectiveListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQualityReviewObjectiveList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quality Review Objective</h1>
        <Button onClick={() => router.push("/quality-review-objective/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={qualityReviewObjectiveColumns}
              data={data}
              onRowClick={(row) => router.push(`/quality-review-objective/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}