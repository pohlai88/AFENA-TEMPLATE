"use client";

// Detail page for Shipment Parcel Template
// Generated from Canon schema — do not edit manually

import { useRouter, useParams } from "next/navigation";
import { useShipmentParcelTemplate, useUpdateShipmentParcelTemplate } from "../hooks/shipment-parcel-template.hooks.js";
import { ShipmentParcelTemplateForm } from "../forms/shipment-parcel-template-form.js";
import type { ShipmentParcelTemplate } from "../types/shipment-parcel-template.js";
import { Button } from "@/components/ui/button";

export function ShipmentParcelTemplateDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data, isLoading: isFetching } = useShipmentParcelTemplate(params.id);
  const updateMutation = useUpdateShipmentParcelTemplate();

  const handleSubmit = (formData: Partial<ShipmentParcelTemplate>) => {
    if (!params.id) return;
    updateMutation.mutate(
      { id: params.id, data: formData },
      { onSuccess: () => router.push("/shipment-parcel-template") },
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
      <Button variant="ghost" onClick={() => router.push("/shipment-parcel-template")}>← Back</Button>
      <ShipmentParcelTemplateForm
        initialData={data}
        onSubmit={handleSubmit}
        mode="edit"
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}