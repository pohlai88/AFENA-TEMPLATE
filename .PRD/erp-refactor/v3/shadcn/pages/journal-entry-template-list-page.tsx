"use client";

// List page for Journal Entry Template
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useJournalEntryTemplateList } from "../hooks/journal-entry-template.hooks.js";
import { journalEntryTemplateColumns } from "../columns/journal-entry-template-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function JournalEntryTemplateListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useJournalEntryTemplateList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Journal Entry Template</h1>
        <Button onClick={() => router.push("/journal-entry-template/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={journalEntryTemplateColumns}
              data={data}
              onRowClick={(row) => router.push(`/journal-entry-template/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}