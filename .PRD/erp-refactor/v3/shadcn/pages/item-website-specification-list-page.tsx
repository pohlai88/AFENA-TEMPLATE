"use client";

// List page for Item Website Specification
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useItemWebsiteSpecificationList } from "../hooks/item-website-specification.hooks.js";
import { itemWebsiteSpecificationColumns } from "../columns/item-website-specification-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ItemWebsiteSpecificationListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useItemWebsiteSpecificationList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Item Website Specification</h1>
        <Button onClick={() => router.push("/item-website-specification/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={itemWebsiteSpecificationColumns}
              data={data}
              onRowClick={(row) => router.push(`/item-website-specification/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}