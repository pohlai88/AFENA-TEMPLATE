"use client";

// Detail page for Finance Book
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useFinanceBook, useUpdateFinanceBook } from "../hooks/finance-book.hooks.js";
import { FinanceBookForm } from "../forms/finance-book-form.js";
import type { FinanceBook } from "../types/finance-book.js";
import { Button } from "@/components/ui/button";

export function FinanceBookDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useFinanceBook(params.id);
  const updateMutation = useUpdateFinanceBook();

  const handleSubmit = (formData: Partial<FinanceBook>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/finance-book") },
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
      <Button variant="ghost" onClick={() => router.push("/finance-book")}>← Back</Button>
      <FinanceBookForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}