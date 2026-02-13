"use client";

// List page for CRM Note
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCrmNoteList } from "../hooks/crm-note.hooks.js";
import { crmNoteColumns } from "../columns/crm-note-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CrmNoteListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCrmNoteList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">CRM Note</h1>
        <Button onClick={() => router.push("/crm-note/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={crmNoteColumns}
              data={data}
              onRowClick={(row) => router.push(`/crm-note/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}