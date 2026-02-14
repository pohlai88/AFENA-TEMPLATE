"use client";

// Detail page for BOM
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBom, useUpdateBom } from "../hooks/bom.hooks.js";
import { BomForm } from "../forms/bom-form.js";
import type { Bom } from "../types/bom.js";
import { Button } from "@/components/ui/button";

export function BomDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBom(params.id);
  const updateMutation = useUpdateBom();

  const handleSubmit = (formData: Partial<Bom>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bom") },
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
      <Button variant="ghost" onClick={() => router.push("/bom")}>← Back</Button>
      <BomForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}