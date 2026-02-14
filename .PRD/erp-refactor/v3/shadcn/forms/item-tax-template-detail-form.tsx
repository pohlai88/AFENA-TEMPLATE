"use client";

// Form for Item Tax Template Detail
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ItemTaxTemplateDetail } from "../types/item-tax-template-detail.js";
import { ItemTaxTemplateDetailInsertSchema } from "../types/item-tax-template-detail.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ItemTaxTemplateDetailFormProps {
  initialData?: Partial<ItemTaxTemplateDetail>;
  onSubmit: (data: Partial<ItemTaxTemplateDetail>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ItemTaxTemplateDetailForm({ initialData = {}, onSubmit, mode, isLoading }: ItemTaxTemplateDetailFormProps) {
  const form = useForm<Partial<ItemTaxTemplateDetail>>({
    resolver: zodResolver(ItemTaxTemplateDetailInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Item Tax Template Detail" : "New Item Tax Template Detail"}
        </h2>
            <FormField control={form.control} name="tax_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tax_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax Rate</FormLabel>
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