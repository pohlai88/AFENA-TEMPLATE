"use client";

// Detail page for Account Category
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAccountCategory, useUpdateAccountCategory } from "../hooks/account-category.hooks.js";
import { AccountCategoryForm } from "../forms/account-category-form.js";
import type { AccountCategory } from "../types/account-category.js";
import { Button } from "@/components/ui/button";

export function AccountCategoryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAccountCategory(params.id);
  const updateMutation = useUpdateAccountCategory();

  const handleSubmit = (formData: Partial<AccountCategory>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/account-category") },
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
      <Button variant="ghost" onClick={() => router.push("/account-category")}>← Back</Button>
      <AccountCategoryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}