"use client";

// List page for Routing
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useRoutingList } from "../hooks/routing.hooks.js";
import { routingColumns } from "../columns/routing-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RoutingListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useRoutingList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Routing</h1>
        <Button onClick={() => router.push("/routing/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={routingColumns}
              data={data}
              onRowClick={(row) => router.push(`/routing/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}