"use client";

// List page for Dunning Letter Text
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useDunningLetterTextList } from "../hooks/dunning-letter-text.hooks.js";
import { dunningLetterTextColumns } from "../columns/dunning-letter-text-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DunningLetterTextListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useDunningLetterTextList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dunning Letter Text</h1>
        <Button onClick={() => router.push("/dunning-letter-text/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={dunningLetterTextColumns}
              data={data}
              onRowClick={(row) => router.push(`/dunning-letter-text/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}