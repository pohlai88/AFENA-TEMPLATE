"use client";

// List page for Email Campaign
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useEmailCampaignList } from "../hooks/email-campaign.hooks.js";
import { emailCampaignColumns } from "../columns/email-campaign-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmailCampaignListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useEmailCampaignList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Email Campaign</h1>
        <Button onClick={() => router.push("/email-campaign/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={emailCampaignColumns}
              data={data}
              onRowClick={(row) => router.push(`/email-campaign/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}