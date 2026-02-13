"use client";

// List page for Sales Team
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSalesTeamList } from "../hooks/sales-team.hooks.js";
import { salesTeamColumns } from "../columns/sales-team-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SalesTeamListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSalesTeamList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales Team</h1>
        <Button onClick={() => router.push("/sales-team/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={salesTeamColumns}
              data={data}
              onRowClick={(row) => router.push(`/sales-team/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}