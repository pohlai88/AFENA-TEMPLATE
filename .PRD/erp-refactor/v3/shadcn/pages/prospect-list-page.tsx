"use client";

// List page for Prospect
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useProspectList } from "../hooks/prospect.hooks.js";
import { prospectColumns } from "../columns/prospect-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProspectListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useProspectList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Prospect</h1>
        <Button onClick={() => router.push("/prospect/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={prospectColumns}
              data={data}
              onRowClick={(row) => router.push(`/prospect/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}