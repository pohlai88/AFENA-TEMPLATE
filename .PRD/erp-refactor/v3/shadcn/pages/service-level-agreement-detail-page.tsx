"use client";

// Detail page for Service Level Agreement
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useServiceLevelAgreement, useUpdateServiceLevelAgreement } from "../hooks/service-level-agreement.hooks.js";
import { ServiceLevelAgreementForm } from "../forms/service-level-agreement-form.js";
import type { ServiceLevelAgreement } from "../types/service-level-agreement.js";
import { Button } from "@/components/ui/button";

export function ServiceLevelAgreementDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useServiceLevelAgreement(params.id);
  const updateMutation = useUpdateServiceLevelAgreement();

  const handleSubmit = (formData: Partial<ServiceLevelAgreement>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/service-level-agreement") },
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
      <Button variant="ghost" onClick={() => router.push("/service-level-agreement")}>← Back</Button>
      <ServiceLevelAgreementForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}