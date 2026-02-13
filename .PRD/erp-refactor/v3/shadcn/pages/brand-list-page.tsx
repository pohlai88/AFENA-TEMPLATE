"use client";

// List page for Brand
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useBrandList } from "../hooks/brand.hooks.js";
import { brandColumns } from "../columns/brand-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BrandListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBrandList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Brand</h1>
        <Button onClick={() => router.push("/brand/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={brandColumns}
              data={data}
              onRowClick={(row) => router.push(`/brand/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}