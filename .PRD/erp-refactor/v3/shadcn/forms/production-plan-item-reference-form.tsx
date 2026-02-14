"use client";

// Form for Production Plan Item Reference
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProductionPlanItemReference } from "../types/production-plan-item-reference.js";
import { ProductionPlanItemReferenceInsertSchema } from "../types/production-plan-item-reference.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ProductionPlanItemReferenceFormProps {
  initialData?: Partial<ProductionPlanItemReference>;
  onSubmit: (data: Partial<ProductionPlanItemReference>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ProductionPlanItemReferenceForm({ initialData = {}, onSubmit, mode, isLoading }: ProductionPlanItemReferenceFormProps) {
  const form = useForm<Partial<ProductionPlanItemReference>>({
    resolver: zodResolver(ProductionPlanItemReferenceInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Production Plan Item Reference" : "New Production Plan Item Reference"}
        </h2>
            <FormField control={form.control} name="item_reference" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Reference</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="sales_order" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Order Reference (→ Sales Order)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Sales Order..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="sales_order_item" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Order Item</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Qty</FormLabel>
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