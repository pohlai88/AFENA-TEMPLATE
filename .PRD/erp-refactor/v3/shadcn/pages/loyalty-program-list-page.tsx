"use client";

// List page for Loyalty Program
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useLoyaltyProgramList } from "../hooks/loyalty-program.hooks.js";
import { loyaltyProgramColumns } from "../columns/loyalty-program-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoyaltyProgramListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useLoyaltyProgramList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Loyalty Program</h1>
        <Button onClick={() => router.push("/loyalty-program/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={loyaltyProgramColumns}
              data={data}
              onRowClick={(row) => router.push(`/loyalty-program/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}