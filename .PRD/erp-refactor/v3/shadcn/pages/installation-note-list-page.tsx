"use client";

// List page for Installation Note
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useInstallationNoteList } from "../hooks/installation-note.hooks.js";
import { installationNoteColumns } from "../columns/installation-note-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InstallationNoteListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useInstallationNoteList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Installation Note</h1>
        <Button onClick={() => router.push("/installation-note/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={installationNoteColumns}
              data={data}
              onRowClick={(row) => router.push(`/installation-note/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}