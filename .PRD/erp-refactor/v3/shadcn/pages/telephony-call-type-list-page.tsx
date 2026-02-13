"use client";

// List page for Telephony Call Type
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useTelephonyCallTypeList } from "../hooks/telephony-call-type.hooks.js";
import { telephonyCallTypeColumns } from "../columns/telephony-call-type-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TelephonyCallTypeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useTelephonyCallTypeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Telephony Call Type</h1>
        <Button onClick={() => router.push("/telephony-call-type/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={telephonyCallTypeColumns}
              data={data}
              onRowClick={(row) => router.push(`/telephony-call-type/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}