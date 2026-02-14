"use client";

// Form for Sales Invoice Reference
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SalesInvoiceReference } from "../types/sales-invoice-reference.js";
import { SalesInvoiceReferenceInsertSchema } from "../types/sales-invoice-reference.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface SalesInvoiceReferenceFormProps {
  initialData?: Partial<SalesInvoiceReference>;
  onSubmit: (data: Partial<SalesInvoiceReference>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SalesInvoiceReferenceForm({ initialData = {}, onSubmit, mode, isLoading }: SalesInvoiceReferenceFormProps) {
  const form = useForm<Partial<SalesInvoiceReference>>({
    resolver: zodResolver(SalesInvoiceReferenceInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Sales Invoice Reference" : "New Sales Invoice Reference"}
        </h2>
            <FormField control={form.control} name="sales_invoice" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Invoice (→ Sales Invoice)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Sales Invoice..." {...f} value={(f.value as string) ?? ""} />
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
                <FormLabel className="">Return Against (→ Sales Invoice)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Sales Invoice..." {...f} value={(f.value as string) ?? ""} disabled />
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