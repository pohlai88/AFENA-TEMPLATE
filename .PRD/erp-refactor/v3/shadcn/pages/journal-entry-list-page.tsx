"use client";

// List page for Journal Entry
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useJournalEntryList } from "../hooks/journal-entry.hooks.js";
import { journalEntryColumns } from "../columns/journal-entry-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function JournalEntryListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useJournalEntryList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Journal Entry</h1>
        <Button onClick={() => router.push("/journal-entry/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={journalEntryColumns}
              data={data}
              onRowClick={(row) => router.push(`/journal-entry/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}