"use client";

// Detail page for Item Barcode
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useItemBarcode, useUpdateItemBarcode } from "../hooks/item-barcode.hooks.js";
import { ItemBarcodeForm } from "../forms/item-barcode-form.js";
import type { ItemBarcode } from "../types/item-barcode.js";
import { Button } from "@/components/ui/button";

export function ItemBarcodeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useItemBarcode(params.id);
  const updateMutation = useUpdateItemBarcode();

  const handleSubmit = (formData: Partial<ItemBarcode>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/item-barcode") },
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
      <Button variant="ghost" onClick={() => router.push("/item-barcode")}>← Back</Button>
      <ItemBarcodeForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}