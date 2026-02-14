"use client";

// Form for POS Invoice Reference
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PosInvoiceReference } from "../types/pos-invoice-reference.js";
import { PosInvoiceReferenceInsertSchema } from "../types/pos-invoice-reference.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface PosInvoiceReferenceFormProps {
  initialData?: Partial<PosInvoiceReference>;
  onSubmit: (data: Partial<PosInvoiceReference>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PosInvoiceReferenceForm({ initialData = {}, onSubmit, mode, isLoading }: PosInvoiceReferenceFormProps) {
  const form = useForm<Partial<PosInvoiceReference>>({
    resolver: zodResolver(PosInvoiceReferenceInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "POS Invoice Reference" : "New POS Invoice Reference"}
        </h2>
            <FormField control={form.control} name="pos_invoice" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">POS Invoice (→ POS Invoice)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search POS Invoice..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="posting_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="customer" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer (→ Customer)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="grand_total" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="is_return" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Is Return</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="return_against" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Return Against (→ POS Invoice)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search POS Invoice..." {...f} value={(f.value as string) ?? ""} disabled />
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