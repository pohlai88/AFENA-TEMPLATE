"use client";

// List page for Opportunity Type
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useOpportunityTypeList } from "../hooks/opportunity-type.hooks.js";
import { opportunityTypeColumns } from "../columns/opportunity-type-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OpportunityTypeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useOpportunityTypeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Opportunity Type</h1>
        <Button onClick={() => router.push("/opportunity-type/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={opportunityTypeColumns}
              data={data}
              onRowClick={(row) => router.push(`/opportunity-type/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}