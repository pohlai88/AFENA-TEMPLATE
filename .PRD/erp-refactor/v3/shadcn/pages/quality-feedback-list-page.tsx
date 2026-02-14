"use client";

// List page for Quality Feedback
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQualityFeedbackList } from "../hooks/quality-feedback.hooks.js";
import { qualityFeedbackColumns } from "../columns/quality-feedback-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QualityFeedbackListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQualityFeedbackList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quality Feedback</h1>
        <Button onClick={() => router.push("/quality-feedback/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={qualityFeedbackColumns}
              data={data}
              onRowClick={(row) => router.push(`/quality-feedback/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}