"use client";

// Detail page for Company
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCompany, useUpdateCompany } from "../hooks/company.hooks.js";
import { CompanyForm } from "../forms/company-form.js";
import type { Company } from "../types/company.js";
import { Button } from "@/components/ui/button";

export function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCompany(params.id);
  const updateMutation = useUpdateCompany();

  const handleSubmit = (formData: Partial<Company>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/company") },
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
      <Button variant="ghost" onClick={() => router.push("/company")}>← Back</Button>
      <CompanyForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}