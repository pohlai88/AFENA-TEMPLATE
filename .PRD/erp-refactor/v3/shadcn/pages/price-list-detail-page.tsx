"use client";

// Detail page for Price List
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { usePriceList, useUpdatePriceList } from "../hooks/price-list.hooks.js";
import { PriceListForm } from "../forms/price-list-form.js";
import type { PriceList } from "../types/price-list.js";
import { Button } from "@/components/ui/button";

export function PriceListDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = usePriceList(params.id);
  const updateMutation = useUpdatePriceList();

  const handleSubmit = (formData: Partial<PriceList>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/price-list") },
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
      <Button variant="ghost" onClick={() => router.push("/price-list")}>← Back</Button>
      <PriceListForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}