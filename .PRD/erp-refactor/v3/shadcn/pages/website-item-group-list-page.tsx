"use client";

// List page for Website Item Group
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useWebsiteItemGroupList } from "../hooks/website-item-group.hooks.js";
import { websiteItemGroupColumns } from "../columns/website-item-group-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WebsiteItemGroupListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useWebsiteItemGroupList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Website Item Group</h1>
        <Button onClick={() => router.push("/website-item-group/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={websiteItemGroupColumns}
              data={data}
              onRowClick={(row) => router.push(`/website-item-group/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}