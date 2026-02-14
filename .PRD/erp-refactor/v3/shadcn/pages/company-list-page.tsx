"use client";

// List page for Company
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useCompanyList } from "../hooks/company.hooks.js";
import { companyColumns } from "../columns/company-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CompanyListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useCompanyList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Company</h1>
        <Button onClick={() => router.push("/company/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={companyColumns}
              data={data}
              onRowClick={(row) => router.push(`/company/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}