"use client";

// List page for Quality Feedback Template
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQualityFeedbackTemplateList } from "../hooks/quality-feedback-template.hooks.js";
import { qualityFeedbackTemplateColumns } from "../columns/quality-feedback-template-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QualityFeedbackTemplateListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQualityFeedbackTemplateList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quality Feedback Template</h1>
        <Button onClick={() => router.push("/quality-feedback-template/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={qualityFeedbackTemplateColumns}
              data={data}
              onRowClick={(row) => router.push(`/quality-feedback-template/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}