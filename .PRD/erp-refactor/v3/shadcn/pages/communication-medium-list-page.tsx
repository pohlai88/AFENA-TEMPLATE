"use client";

// List page for Communication Medium
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCommunicationMediumList } from "../hooks/communication-medium.hooks.js";
import { communicationMediumColumns } from "../columns/communication-medium-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CommunicationMediumListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCommunicationMediumList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Communication Medium</h1>
        <Button onClick={() => router.push("/communication-medium/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={communicationMediumColumns}
              data={data}
              onRowClick={(row) => router.push(`/communication-medium/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}