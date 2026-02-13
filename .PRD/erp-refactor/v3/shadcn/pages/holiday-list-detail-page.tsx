"use client";

// Detail page for Holiday List
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useHolidayList, useUpdateHolidayList } from "../hooks/holiday-list.hooks.js";
import { HolidayListForm } from "../forms/holiday-list-form.js";
import type { HolidayList } from "../types/holiday-list.js";
import { Button } from "@/components/ui/button";

export function HolidayListDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useHolidayList(params.id);
  const updateMutation = useUpdateHolidayList();

  const handleSubmit = (formData: Partial<HolidayList>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/holiday-list") },
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
      <Button variant="ghost" onClick={() => router.push("/holiday-list")}>← Back</Button>
      <HolidayListForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}