"use client";

// List page for Subscription Plan Detail
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSubscriptionPlanDetailList } from "../hooks/subscription-plan-detail.hooks.js";
import { subscriptionPlanDetailColumns } from "../columns/subscription-plan-detail-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubscriptionPlanDetailListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSubscriptionPlanDetailList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Subscription Plan Detail</h1>
        <Button onClick={() => router.push("/subscription-plan-detail/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={subscriptionPlanDetailColumns}
              data={data}
              onRowClick={(row) => router.push(`/subscription-plan-detail/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}