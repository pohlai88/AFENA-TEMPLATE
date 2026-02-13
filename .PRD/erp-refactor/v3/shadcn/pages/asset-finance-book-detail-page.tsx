"use client";

// Detail page for Asset Finance Book
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useAssetFinanceBook, useUpdateAssetFinanceBook } from "../hooks/asset-finance-book.hooks.js";
import { AssetFinanceBookForm } from "../forms/asset-finance-book-form.js";
import type { AssetFinanceBook } from "../types/asset-finance-book.js";
import { Button } from "@/components/ui/button";

export function AssetFinanceBookDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useAssetFinanceBook(params.id);
  const updateMutation = useUpdateAssetFinanceBook();

  const handleSubmit = (formData: Partial<AssetFinanceBook>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/asset-finance-book") },
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
      <Button variant="ghost" onClick={() => router.push("/asset-finance-book")}>← Back</Button>
      <AssetFinanceBookForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}