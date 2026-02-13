"use client";

// List page for Subscription
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSubscriptionList } from "../hooks/subscription.hooks.js";
import { subscriptionColumns } from "../columns/subscription-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubscriptionListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSubscriptionList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
        <Button onClick={() => router.push("/subscription/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={subscriptionColumns}
              data={data}
              onRowClick={(row) => router.push(`/subscription/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}