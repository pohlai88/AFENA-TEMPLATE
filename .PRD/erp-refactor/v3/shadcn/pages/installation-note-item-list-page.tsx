"use client";

// List page for Installation Note Item
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useInstallationNoteItemList } from "../hooks/installation-note-item.hooks.js";
import { installationNoteItemColumns } from "../columns/installation-note-item-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InstallationNoteItemListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useInstallationNoteItemList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Installation Note Item</h1>
        <Button onClick={() => router.push("/installation-note-item/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={installationNoteItemColumns}
              data={data}
              onRowClick={(row) => router.push(`/installation-note-item/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}