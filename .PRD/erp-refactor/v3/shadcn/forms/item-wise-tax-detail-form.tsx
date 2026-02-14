"use client";

// Form for Item Wise Tax Detail
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ItemWiseTaxDetail } from "../types/item-wise-tax-detail.js";
import { ItemWiseTaxDetailInsertSchema } from "../types/item-wise-tax-detail.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ItemWiseTaxDetailFormProps {
  initialData?: Partial<ItemWiseTaxDetail>;
  onSubmit: (data: Partial<ItemWiseTaxDetail>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ItemWiseTaxDetailForm({ initialData = {}, onSubmit, mode, isLoading }: ItemWiseTaxDetailFormProps) {
  const form = useForm<Partial<ItemWiseTaxDetail>>({
    resolver: zodResolver(ItemWiseTaxDetailInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Item Wise Tax Detail" : "New Item Wise Tax Detail"}
        </h2>
            <FormField control={form.control} name="item_row" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Row</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="tax_row" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax Row</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Tax Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="taxable_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Taxable Amount</FormLabel>
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