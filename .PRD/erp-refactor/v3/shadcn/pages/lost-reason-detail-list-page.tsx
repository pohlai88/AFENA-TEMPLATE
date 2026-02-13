"use client";

// List page for Lost Reason Detail
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useLostReasonDetailList } from "../hooks/lost-reason-detail.hooks.js";
import { lostReasonDetailColumns } from "../columns/lost-reason-detail-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LostReasonDetailListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useLostReasonDetailList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Lost Reason Detail</h1>
        <Button onClick={() => router.push("/lost-reason-detail/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={lostReasonDetailColumns}
              data={data}
              onRowClick={(row) => router.push(`/lost-reason-detail/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}