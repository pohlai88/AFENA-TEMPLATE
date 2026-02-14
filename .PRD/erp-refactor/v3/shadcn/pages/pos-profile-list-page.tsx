"use client";

// List page for POS Profile
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePosProfileList } from "../hooks/pos-profile.hooks.js";
import { posProfileColumns } from "../columns/pos-profile-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PosProfileListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePosProfileList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">POS Profile</h1>
        <Button onClick={() => router.push("/pos-profile/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={posProfileColumns}
              data={data}
              onRowClick={(row) => router.push(`/pos-profile/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}