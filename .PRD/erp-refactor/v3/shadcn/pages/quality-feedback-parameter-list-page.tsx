"use client";

// List page for Quality Feedback Parameter
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQualityFeedbackParameterList } from "../hooks/quality-feedback-parameter.hooks.js";
import { qualityFeedbackParameterColumns } from "../columns/quality-feedback-parameter-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QualityFeedbackParameterListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQualityFeedbackParameterList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quality Feedback Parameter</h1>
        <Button onClick={() => router.push("/quality-feedback-parameter/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={qualityFeedbackParameterColumns}
              data={data}
              onRowClick={(row) => router.push(`/quality-feedback-parameter/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}