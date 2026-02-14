"use client";

// Detail page for Authorization Rule
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAuthorizationRule, useUpdateAuthorizationRule } from "../hooks/authorization-rule.hooks.js";
import { AuthorizationRuleForm } from "../forms/authorization-rule-form.js";
import type { AuthorizationRule } from "../types/authorization-rule.js";
import { Button } from "@/components/ui/button";

export function AuthorizationRuleDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAuthorizationRule(params.id);
  const updateMutation = useUpdateAuthorizationRule();

  const handleSubmit = (formData: Partial<AuthorizationRule>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/authorization-rule") },
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
      <Button variant="ghost" onClick={() => router.push("/authorization-rule")}>← Back</Button>
      <AuthorizationRuleForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}