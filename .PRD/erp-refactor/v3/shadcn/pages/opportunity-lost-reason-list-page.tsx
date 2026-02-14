"use client";

// List page for Opportunity Lost Reason
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useOpportunityLostReasonList } from "../hooks/opportunity-lost-reason.hooks.js";
import { opportunityLostReasonColumns } from "../columns/opportunity-lost-reason-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OpportunityLostReasonListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useOpportunityLostReasonList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Opportunity Lost Reason</h1>
        <Button onClick={() => router.push("/opportunity-lost-reason/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={opportunityLostReasonColumns}
              data={data}
              onRowClick={(row) => router.push(`/opportunity-lost-reason/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}