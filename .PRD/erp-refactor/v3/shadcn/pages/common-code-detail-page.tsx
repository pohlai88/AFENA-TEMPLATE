"use client";

// Detail page for Common Code
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useCommonCode, useUpdateCommonCode } from "../hooks/common-code.hooks.js";
import { CommonCodeForm } from "../forms/common-code-form.js";
import type { CommonCode } from "../types/common-code.js";
import { Button } from "@/components/ui/button";

export function CommonCodeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useCommonCode(params.id);
  const updateMutation = useUpdateCommonCode();

  const handleSubmit = (formData: Partial<CommonCode>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/common-code") },
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
      <Button variant="ghost" onClick={() => router.push("/common-code")}>← Back</Button>
      <CommonCodeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}