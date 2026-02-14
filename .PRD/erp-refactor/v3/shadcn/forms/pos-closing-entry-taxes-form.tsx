"use client";

// Form for POS Closing Entry Taxes
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PosClosingEntryTaxes } from "../types/pos-closing-entry-taxes.js";
import { PosClosingEntryTaxesInsertSchema } from "../types/pos-closing-entry-taxes.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PosClosingEntryTaxesFormProps {
  initialData?: Partial<PosClosingEntryTaxes>;
  onSubmit: (data: Partial<PosClosingEntryTaxes>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PosClosingEntryTaxesForm({ initialData = {}, onSubmit, mode, isLoading }: PosClosingEntryTaxesFormProps) {
  const form = useForm<Partial<PosClosingEntryTaxes>>({
    resolver: zodResolver(PosClosingEntryTaxesInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "POS Closing Entry Taxes" : "New POS Closing Entry Taxes"}
        </h2>
            <FormField control={form.control} name="account_head" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account Head (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amount</FormLabel>
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