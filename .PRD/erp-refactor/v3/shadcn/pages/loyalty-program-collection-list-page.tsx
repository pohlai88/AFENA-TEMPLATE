"use client";

// List page for Loyalty Program Collection
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useLoyaltyProgramCollectionList } from "../hooks/loyalty-program-collection.hooks.js";
import { loyaltyProgramCollectionColumns } from "../columns/loyalty-program-collection-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoyaltyProgramCollectionListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useLoyaltyProgramCollectionList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Loyalty Program Collection</h1>
        <Button onClick={() => router.push("/loyalty-program-collection/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={loyaltyProgramCollectionColumns}
              data={data}
              onRowClick={(row) => router.push(`/loyalty-program-collection/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}