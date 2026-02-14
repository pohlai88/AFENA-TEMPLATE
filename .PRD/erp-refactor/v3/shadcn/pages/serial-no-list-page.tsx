"use client";

// List page for Serial No
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSerialNoList } from "../hooks/serial-no.hooks.js";
import { serialNoColumns } from "../columns/serial-no-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SerialNoListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSerialNoList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Serial No</h1>
        <Button onClick={() => router.push("/serial-no/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={serialNoColumns}
              data={data}
              onRowClick={(row) => router.push(`/serial-no/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}