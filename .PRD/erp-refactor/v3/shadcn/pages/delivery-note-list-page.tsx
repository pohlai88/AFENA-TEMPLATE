"use client";

// List page for Delivery Note
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useDeliveryNoteList } from "../hooks/delivery-note.hooks.js";
import { deliveryNoteColumns } from "../columns/delivery-note-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DeliveryNoteListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useDeliveryNoteList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Delivery Note</h1>
        <Button onClick={() => router.push("/delivery-note/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={deliveryNoteColumns}
              data={data}
              onRowClick={(row) => router.push(`/delivery-note/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}