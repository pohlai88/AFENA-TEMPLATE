"use client";

// List page for SMS Center
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useSmsCenterList } from "../hooks/sms-center.hooks.js";
import { smsCenterColumns } from "../columns/sms-center-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SmsCenterListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSmsCenterList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">SMS Center</h1>
        <Button onClick={() => router.push("/sms-center/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={smsCenterColumns}
              data={data}
              onRowClick={(row) => router.push(`/sms-center/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}