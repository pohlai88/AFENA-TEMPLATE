"use client";

// Form for Item Tax
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ItemTax } from "../types/item-tax.js";
import { ItemTaxInsertSchema } from "../types/item-tax.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ItemTaxFormProps {
  initialData?: Partial<ItemTax>;
  onSubmit: (data: Partial<ItemTax>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ItemTaxForm({ initialData = {}, onSubmit, mode, isLoading }: ItemTaxFormProps) {
  const form = useForm<Partial<ItemTax>>({
    resolver: zodResolver(ItemTaxInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Item Tax" : "New Item Tax"}
        </h2>
            <FormField control={form.control} name="item_tax_template" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Tax Template (→ Item Tax Template)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item Tax Template..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tax_category" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax Category (→ Tax Category)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Tax Category..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="valid_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Valid From</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="minimum_net_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Minimum Net Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="maximum_net_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Maximum Net Rate</FormLabel>
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