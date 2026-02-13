"use client";

// List page for Website Attribute
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useWebsiteAttributeList } from "../hooks/website-attribute.hooks.js";
import { websiteAttributeColumns } from "../columns/website-attribute-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WebsiteAttributeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useWebsiteAttributeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Website Attribute</h1>
        <Button onClick={() => router.push("/website-attribute/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={websiteAttributeColumns}
              data={data}
              onRowClick={(row) => router.push(`/website-attribute/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}