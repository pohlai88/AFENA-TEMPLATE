"use client";

// Detail page for Putaway Rule
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePutawayRule, useUpdatePutawayRule } from "../hooks/putaway-rule.hooks.js";
import { PutawayRuleForm } from "../forms/putaway-rule-form.js";
import type { PutawayRule } from "../types/putaway-rule.js";
import { Button } from "@/components/ui/button";

export function PutawayRuleDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePutawayRule(params.id);
  const updateMutation = useUpdatePutawayRule();

  const handleSubmit = (formData: Partial<PutawayRule>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/putaway-rule") },
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
      <Button variant="ghost" onClick={() => router.push("/putaway-rule")}>← Back</Button>
      <PutawayRuleForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}