"use client";

// List page for Subscription Plan
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSubscriptionPlanList } from "../hooks/subscription-plan.hooks.js";
import { subscriptionPlanColumns } from "../columns/subscription-plan-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubscriptionPlanListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSubscriptionPlanList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Subscription Plan</h1>
        <Button onClick={() => router.push("/subscription-plan/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={subscriptionPlanColumns}
              data={data}
              onRowClick={(row) => router.push(`/subscription-plan/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}