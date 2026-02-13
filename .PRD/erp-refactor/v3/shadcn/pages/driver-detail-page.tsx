"use client";

// Detail page for Driver
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useDriver, useUpdateDriver } from "../hooks/driver.hooks.js";
import { DriverForm } from "../forms/driver-form.js";
import type { Driver } from "../types/driver.js";
import { Button } from "@/components/ui/button";

export function DriverDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useDriver(params.id);
  const updateMutation = useUpdateDriver();

  const handleSubmit = (formData: Partial<Driver>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/driver") },
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
      <Button variant="ghost" onClick={() => router.push("/driver")}>← Back</Button>
      <DriverForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}