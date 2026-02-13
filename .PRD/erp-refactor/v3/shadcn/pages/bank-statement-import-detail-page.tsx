"use client";

// Detail page for Bank Statement Import
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBankStatementImport, useUpdateBankStatementImport } from "../hooks/bank-statement-import.hooks.js";
import { BankStatementImportForm } from "../forms/bank-statement-import-form.js";
import type { BankStatementImport } from "../types/bank-statement-import.js";
import { Button } from "@/components/ui/button";

export function BankStatementImportDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBankStatementImport(params.id);
  const updateMutation = useUpdateBankStatementImport();

  const handleSubmit = (formData: Partial<BankStatementImport>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bank-statement-import") },
    );
  };

  if (isFetching) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  if (!data) {
    return <p className="text-destructive">Not found</p>;
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => router.push("/bank-statement-import")}>← Back</Button>
      <BankStatementImportForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}