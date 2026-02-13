"use client";

// List page for Portal User
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePortalUserList } from "../hooks/portal-user.hooks.js";
import { portalUserColumns } from "../columns/portal-user-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PortalUserListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePortalUserList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Portal User</h1>
        <Button onClick={() => router.push("/portal-user/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={portalUserColumns}
              data={data}
              onRowClick={(row) => router.push(`/portal-user/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}