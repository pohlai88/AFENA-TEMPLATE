"use client";

// List page for Promotional Scheme
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { usePromotionalSchemeList } from "../hooks/promotional-scheme.hooks.js";
import { promotionalSchemeColumns } from "../columns/promotional-scheme-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PromotionalSchemeListPage() {
  const router = useRouter();
  const { data, isLoading, error } = usePromotionalSchemeList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Promotional Scheme</h1>
        <Button onClick={() => router.push("/promotional-scheme/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={promotionalSchemeColumns}
              data={data}
              onRowClick={(row) => router.push(`/promotional-scheme/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}