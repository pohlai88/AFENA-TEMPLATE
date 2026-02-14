"use client";

// List page for Opportunity Lost Reason Detail
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useOpportunityLostReasonDetailList } from "../hooks/opportunity-lost-reason-detail.hooks.js";
import { opportunityLostReasonDetailColumns } from "../columns/opportunity-lost-reason-detail-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OpportunityLostReasonDetailListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useOpportunityLostReasonDetailList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Opportunity Lost Reason Detail</h1>
        <Button onClick={() => router.push("/opportunity-lost-reason-detail/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={opportunityLostReasonDetailColumns}
              data={data}
              onRowClick={(row) => router.push(`/opportunity-lost-reason-detail/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}