"use client";

// List page for Opportunity Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useOpportunityItemList } from "../hooks/opportunity-item.hooks.js";
import { opportunityItemColumns } from "../columns/opportunity-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OpportunityItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useOpportunityItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Opportunity Item</h1>
        <Button onClick={() => router.push("/opportunity-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={opportunityItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/opportunity-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}