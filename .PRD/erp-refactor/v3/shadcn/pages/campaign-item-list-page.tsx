"use client";

// List page for Campaign Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCampaignItemList } from "../hooks/campaign-item.hooks.js";
import { campaignItemColumns } from "../columns/campaign-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CampaignItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCampaignItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Campaign Item</h1>
        <Button onClick={() => router.push("/campaign-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={campaignItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/campaign-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}