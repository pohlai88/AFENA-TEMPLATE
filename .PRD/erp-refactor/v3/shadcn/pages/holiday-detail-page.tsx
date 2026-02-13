"use client";

// Detail page for Holiday
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useHoliday, useUpdateHoliday } from "../hooks/holiday.hooks.js";
import { HolidayForm } from "../forms/holiday-form.js";
import type { Holiday } from "../types/holiday.js";
import { Button } from "@/components/ui/button";

export function HolidayDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useHoliday(params.id);
  const updateMutation = useUpdateHoliday();

  const handleSubmit = (formData: Partial<Holiday>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/holiday") },
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
      <Button variant="ghost" onClick={() => router.push("/holiday")}>← Back</Button>
      <HolidayForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}