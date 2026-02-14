"use client";

// Form for Asset Repair Consumed Item
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AssetRepairConsumedItem } from "../types/asset-repair-consumed-item.js";
import { AssetRepairConsumedItemInsertSchema } from "../types/asset-repair-consumed-item.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AssetRepairConsumedItemFormProps {
  initialData?: Partial<AssetRepairConsumedItem>;
  onSubmit: (data: Partial<AssetRepairConsumedItem>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function AssetRepairConsumedItemForm({ initialData = {}, onSubmit, mode, isLoading }: AssetRepairConsumedItemFormProps) {
  const form = useForm<Partial<AssetRepairConsumedItem>>({
    resolver: zodResolver(AssetRepairConsumedItemInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Asset Repair Consumed Item" : "New Asset Repair Consumed Item"}
        </h2>
            <FormField control={form.control} name="item_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item (→ Item)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="warehouse" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Warehouse (→ Warehouse)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Warehouse..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="valuation_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Valuation Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="consumed_quantity" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Consumed Quantity</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_value" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Total Value</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="serial_and_batch_bundle" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Serial and Batch Bundle (→ Serial and Batch Bundle)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Serial and Batch Bundle..." {...f} value={(f.value as string) ?? ""} />
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