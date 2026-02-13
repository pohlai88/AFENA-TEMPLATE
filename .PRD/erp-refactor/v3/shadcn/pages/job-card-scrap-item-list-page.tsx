"use client";

// List page for Job Card Scrap Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useJobCardScrapItemList } from "../hooks/job-card-scrap-item.hooks.js";
import { jobCardScrapItemColumns } from "../columns/job-card-scrap-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function JobCardScrapItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useJobCardScrapItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Job Card Scrap Item</h1>
        <Button onClick={() => router.push("/job-card-scrap-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={jobCardScrapItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/job-card-scrap-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}