"use client";

// Form for Shipment Parcel Template
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ShipmentParcelTemplate } from "../types/shipment-parcel-template.js";
import { ShipmentParcelTemplateInsertSchema } from "../types/shipment-parcel-template.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ShipmentParcelTemplateFormProps {
  initialData?: Partial<ShipmentParcelTemplate>;
  onSubmit: (data: Partial<ShipmentParcelTemplate>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ShipmentParcelTemplateForm({ initialData = {}, onSubmit, mode, isLoading }: ShipmentParcelTemplateFormProps) {
  const form = useForm<Partial<ShipmentParcelTemplate>>({
    resolver: zodResolver(ShipmentParcelTemplateInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Shipment Parcel Template" : "New Shipment Parcel Template"}
        </h2>
            <FormField control={form.control} name="parcel_template_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Parcel Template Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="length" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Length (cm)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="width" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Width (cm)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="height" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Height (cm)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="weight" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Weight (kg)</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
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