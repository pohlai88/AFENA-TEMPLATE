"use client";

// List page for Quality Feedback Template Parameter
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQualityFeedbackTemplateParameterList } from "../hooks/quality-feedback-template-parameter.hooks.js";
import { qualityFeedbackTemplateParameterColumns } from "../columns/quality-feedback-template-parameter-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QualityFeedbackTemplateParameterListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQualityFeedbackTemplateParameterList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quality Feedback Template Parameter</h1>
        <Button onClick={() => router.push("/quality-feedback-template-parameter/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={qualityFeedbackTemplateParameterColumns}
              data={data}
              onRowClick={(row) => router.push(`/quality-feedback-template-parameter/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}