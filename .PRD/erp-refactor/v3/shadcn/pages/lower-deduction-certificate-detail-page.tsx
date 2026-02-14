"use client";

// Detail page for Lower Deduction Certificate
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useLowerDeductionCertificate, useUpdateLowerDeductionCertificate } from "../hooks/lower-deduction-certificate.hooks.js";
import { LowerDeductionCertificateForm } from "../forms/lower-deduction-certificate-form.js";
import type { LowerDeductionCertificate } from "../types/lower-deduction-certificate.js";
import { Button } from "@/components/ui/button";

export function LowerDeductionCertificateDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useLowerDeductionCertificate(params.id);
  const updateMutation = useUpdateLowerDeductionCertificate();

  const handleSubmit = (formData: Partial<LowerDeductionCertificate>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/lower-deduction-certificate") },
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
      <Button variant="ghost" onClick={() => router.push("/lower-deduction-certificate")}>← Back</Button>
      <LowerDeductionCertificateForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}