"use client";

// Detail page for Bin
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useBin, useUpdateBin } from "../hooks/bin.hooks.js";
import { BinForm } from "../forms/bin-form.js";
import type { Bin } from "../types/bin.js";
import { Button } from "@/components/ui/button";

export function BinDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useBin(params.id);
  const updateMutation = useUpdateBin();

  const handleSubmit = (formData: Partial<Bin>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/bin") },
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
      <Button variant="ghost" onClick={() => router.push("/bin")}>← Back</Button>
      <BinForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}