"use client";

// List page for Quality Review
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQualityReviewList } from "../hooks/quality-review.hooks.js";
import { qualityReviewColumns } from "../columns/quality-review-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QualityReviewListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQualityReviewList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quality Review</h1>
        <Button onClick={() => router.push("/quality-review/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={qualityReviewColumns}
              data={data}
              onRowClick={(row) => router.push(`/quality-review/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}