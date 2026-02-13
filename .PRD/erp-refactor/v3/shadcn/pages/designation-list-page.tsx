"use client";

// List page for Designation
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useDesignationList } from "../hooks/designation.hooks.js";
import { designationColumns } from "../columns/designation-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DesignationListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useDesignationList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Designation</h1>
        <Button onClick={() => router.push("/designation/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={designationColumns}
              data={data}
              onRowClick={(row) => router.push(`/designation/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}