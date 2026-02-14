"use client";

// List page for Service Level Agreement
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useServiceLevelAgreementList } from "../hooks/service-level-agreement.hooks.js";
import { serviceLevelAgreementColumns } from "../columns/service-level-agreement-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ServiceLevelAgreementListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useServiceLevelAgreementList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Service Level Agreement</h1>
        <Button onClick={() => router.push("/service-level-agreement/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={serviceLevelAgreementColumns}
              data={data}
              onRowClick={(row) => router.push(`/service-level-agreement/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}