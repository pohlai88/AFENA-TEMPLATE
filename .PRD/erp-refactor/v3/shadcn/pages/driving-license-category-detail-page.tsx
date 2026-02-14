"use client";

// Detail page for Driving License Category
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useDrivingLicenseCategory, useUpdateDrivingLicenseCategory } from "../hooks/driving-license-category.hooks.js";
import { DrivingLicenseCategoryForm } from "../forms/driving-license-category-form.js";
import type { DrivingLicenseCategory } from "../types/driving-license-category.js";
import { Button } from "@/components/ui/button";

export function DrivingLicenseCategoryDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useDrivingLicenseCategory(params.id);
  const updateMutation = useUpdateDrivingLicenseCategory();

  const handleSubmit = (formData: Partial<DrivingLicenseCategory>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/driving-license-category") },
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
      <Button variant="ghost" onClick={() => router.push("/driving-license-category")}>← Back</Button>
      <DrivingLicenseCategoryForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}