"use client";

// List page for Contract Template Fulfilment Terms
// Generated from Canon schema — do not edit manually

import { useRouter } from "next/navigation";
import { useContractTemplateFulfilmentTermsList } from "../hooks/contract-template-fulfilment-terms.hooks.js";
import { contractTemplateFulfilmentTermsColumns } from "../columns/contract-template-fulfilment-terms-columns.js";
import { DataTable } from "../lib/data-table.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ContractTemplateFulfilmentTermsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useContractTemplateFulfilmentTermsList();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Contract Template Fulfilment Terms</h1>
        <Button onClick={() => router.push("/contract-template-fulfilment-terms/new")}>Create</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <p className="text-muted-foreground">Loading...</p>}
          {error && <p className="text-destructive">Error loading data</p>}
          {data && (
            <DataTable
              columns={contractTemplateFulfilmentTermsColumns}
              data={data}
              onRowClick={(row) => router.push(`/contract-template-fulfilment-terms/${row.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}