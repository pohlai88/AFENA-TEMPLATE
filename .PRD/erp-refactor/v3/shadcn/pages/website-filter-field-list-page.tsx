"use client";

// List page for Website Filter Field
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useWebsiteFilterFieldList } from "../hooks/website-filter-field.hooks.js";
import { websiteFilterFieldColumns } from "../columns/website-filter-field-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WebsiteFilterFieldListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useWebsiteFilterFieldList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Website Filter Field</h1>
        <Button onClick={() => router.push("/website-filter-field/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={websiteFilterFieldColumns}
              data={data}
              onRowClick={(row) => router.push(`/website-filter-field/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}