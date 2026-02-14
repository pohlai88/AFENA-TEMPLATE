"use client";

// List page for Asset Activity
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAssetActivityList } from "../hooks/asset-activity.hooks.js";
import { assetActivityColumns } from "../columns/asset-activity-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AssetActivityListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAssetActivityList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Asset Activity</h1>
        <Button onClick={() => router.push("/asset-activity/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={assetActivityColumns}
              data={data}
              onRowClick={(row) => router.push(`/asset-activity/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}