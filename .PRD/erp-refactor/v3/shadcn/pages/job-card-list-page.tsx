"use client";

// List page for Job Card
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useJobCardList } from "../hooks/job-card.hooks.js";
import { jobCardColumns } from "../columns/job-card-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function JobCardListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useJobCardList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Job Card</h1>
        <Button onClick={() => router.push("/job-card/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={jobCardColumns}
              data={data}
              onRowClick={(row) => router.push(`/job-card/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}