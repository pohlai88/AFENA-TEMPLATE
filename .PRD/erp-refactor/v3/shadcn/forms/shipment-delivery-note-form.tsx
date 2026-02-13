"use client";

// Form for Shipment Delivery Note
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ShipmentDeliveryNote } from "../types/shipment-delivery-note.js";
import { ShipmentDeliveryNoteInsertSchema } from "../types/shipment-delivery-note.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ShipmentDeliveryNoteFormProps {
  initialData?: Partial<ShipmentDeliveryNote>;
  onSubmit: (data: Partial<ShipmentDeliveryNote>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ShipmentDeliveryNoteForm({ initialData = {}, onSubmit, mode, isLoading }: ShipmentDeliveryNoteFormProps) {
  const form = useForm<Partial<ShipmentDeliveryNote>>({
    resolver: zodResolver(ShipmentDeliveryNoteInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Shipment Delivery Note" : "New Shipment Delivery Note"}
        </h2>
            <FormField control={form.control} name="delivery_note" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Delivery Note (→ Delivery Note)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Delivery Note..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="grand_total" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Value</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}