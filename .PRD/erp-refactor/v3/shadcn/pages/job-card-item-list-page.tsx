"use client";

// List page for Job Card Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useJobCardItemList } from "../hooks/job-card-item.hooks.js";
import { jobCardItemColumns } from "../columns/job-card-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function JobCardItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useJobCardItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Job Card Item</h1>
        <Button onClick={() => router.push("/job-card-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={jobCardItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/job-card-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}