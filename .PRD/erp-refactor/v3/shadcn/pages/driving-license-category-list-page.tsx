"use client";

// List page for Driving License Category
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useDrivingLicenseCategoryList } from "../hooks/driving-license-category.hooks.js";
import { drivingLicenseCategoryColumns } from "../columns/driving-license-category-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DrivingLicenseCategoryListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useDrivingLicenseCategoryList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Driving License Category</h1>
        <Button onClick={() => router.push("/driving-license-category/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={drivingLicenseCategoryColumns}
              data={data}
              onRowClick={(row) => router.push(`/driving-license-category/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}