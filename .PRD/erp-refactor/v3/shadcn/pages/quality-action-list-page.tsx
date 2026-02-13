"use client";

// List page for Quality Action
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useQualityActionList } from "../hooks/quality-action.hooks.js";
import { qualityActionColumns } from "../columns/quality-action-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QualityActionListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useQualityActionList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quality Action</h1>
        <Button onClick={() => router.push("/quality-action/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={qualityActionColumns}
              data={data}
              onRowClick={(row) => router.push(`/quality-action/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}