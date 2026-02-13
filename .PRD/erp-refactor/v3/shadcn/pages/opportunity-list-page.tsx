"use client";

// List page for Opportunity
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useOpportunityList } from "../hooks/opportunity.hooks.js";
import { opportunityColumns } from "../columns/opportunity-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OpportunityListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useOpportunityList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Opportunity</h1>
        <Button onClick={() => router.push("/opportunity/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={opportunityColumns}
              data={data}
              onRowClick={(row) => router.push(`/opportunity/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}