"use client";

// List page for Process Subscription
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProcessSubscriptionList } from "../hooks/process-subscription.hooks.js";
import { processSubscriptionColumns } from "../columns/process-subscription-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProcessSubscriptionListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProcessSubscriptionList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Process Subscription</h1>
        <Button onClick={() => router.push("/process-subscription/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={processSubscriptionColumns}
              data={data}
              onRowClick={(row) => router.push(`/process-subscription/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}