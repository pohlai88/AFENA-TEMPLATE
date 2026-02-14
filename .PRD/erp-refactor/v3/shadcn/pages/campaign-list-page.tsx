"use client";

// List page for Campaign
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCampaignList } from "../hooks/campaign.hooks.js";
import { campaignColumns } from "../columns/campaign-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CampaignListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCampaignList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Campaign</h1>
        <Button onClick={() => router.push("/campaign/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={campaignColumns}
              data={data}
              onRowClick={(row) => router.push(`/campaign/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}