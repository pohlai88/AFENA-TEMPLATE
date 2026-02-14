"use client";

// Form for Sales Invoice Advance
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SalesInvoiceAdvance } from "../types/sales-invoice-advance.js";
import { SalesInvoiceAdvanceInsertSchema } from "../types/sales-invoice-advance.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SalesInvoiceAdvanceFormProps {
  initialData?: Partial<SalesInvoiceAdvance>;
  onSubmit: (data: Partial<SalesInvoiceAdvance>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SalesInvoiceAdvanceForm({ initialData = {}, onSubmit, mode, isLoading }: SalesInvoiceAdvanceFormProps) {
  const form = useForm<Partial<SalesInvoiceAdvance>>({
    resolver: zodResolver(SalesInvoiceAdvanceInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Sales Invoice Advance" : "New Sales Invoice Advance"}
        </h2>
            <FormField control={form.control} name="reference_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Reference Type (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="reference_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Reference Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="remarks" render={({ field: f }) => (
              <FormItem className="col-span-2">
                <FormLabel className="">Remarks</FormLabel>
                <FormControl>
                  <Textarea className="" rows={4} {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="advance_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Advance amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="allocated_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Allocated amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().exchange_gain_loss && (
            <FormField control={form.control} name="exchange_gain_loss" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Exchange Gain/Loss</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            {!!form.getValues().exchange_gain_loss && (
            <FormField control={form.control} name="ref_exchange_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Reference Exchange Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="difference_posting_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Difference Posting Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
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