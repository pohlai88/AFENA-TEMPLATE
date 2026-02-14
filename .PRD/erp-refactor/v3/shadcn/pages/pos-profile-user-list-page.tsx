"use client";

// List page for POS Profile User
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePosProfileUserList } from "../hooks/pos-profile-user.hooks.js";
import { posProfileUserColumns } from "../columns/pos-profile-user-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PosProfileUserListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePosProfileUserList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">POS Profile User</h1>
        <Button onClick={() => router.push("/pos-profile-user/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={posProfileUserColumns}
              data={data}
              onRowClick={(row) => router.push(`/pos-profile-user/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}