"use client";

// List page for Lead
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useLeadList } from "../hooks/lead.hooks.js";
import { leadColumns } from "../columns/lead-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LeadListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useLeadList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Lead</h1>
        <Button onClick={() => router.push("/lead/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={leadColumns}
              data={data}
              onRowClick={(row) => router.push(`/lead/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}