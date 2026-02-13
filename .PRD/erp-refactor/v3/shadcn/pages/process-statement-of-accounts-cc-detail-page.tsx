"use client";

// Detail page for Process Statement Of Accounts CC
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useProcessStatementOfAccountsCc, useUpdateProcessStatementOfAccountsCc } from "../hooks/process-statement-of-accounts-cc.hooks.js";
import { ProcessStatementOfAccountsCcForm } from "../forms/process-statement-of-accounts-cc-form.js";
import type { ProcessStatementOfAccountsCc } from "../types/process-statement-of-accounts-cc.js";
import { Button } from "@/components/ui/button";

export function ProcessStatementOfAccountsCcDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useProcessStatementOfAccountsCc(params.id);
  const updateMutation = useUpdateProcessStatementOfAccountsCc();

  const handleSubmit = (formData: Partial<ProcessStatementOfAccountsCc>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/process-statement-of-accounts-cc") },
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
      <Button variant="ghost" onClick={() => router.push("/process-statement-of-accounts-cc")}>← Back</Button>
      <ProcessStatementOfAccountsCcForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}