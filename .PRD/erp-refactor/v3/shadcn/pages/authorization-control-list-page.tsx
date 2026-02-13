"use client";

// List page for Authorization Control
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useAuthorizationControlList } from "../hooks/authorization-control.hooks.js";
import { authorizationControlColumns } from "../columns/authorization-control-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthorizationControlListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useAuthorizationControlList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Authorization Control</h1>
        <Button onClick={() => router.push("/authorization-control/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={authorizationControlColumns}
              data={data}
              onRowClick={(row) => router.push(`/authorization-control/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}