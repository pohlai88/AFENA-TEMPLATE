"use client";

// Form for Payment Reconciliation Invoice
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PaymentReconciliationInvoice } from "../types/payment-reconciliation-invoice.js";
import { PaymentReconciliationInvoiceInsertSchema } from "../types/payment-reconciliation-invoice.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface PaymentReconciliationInvoiceFormProps {
  initialData?: Partial<PaymentReconciliationInvoice>;
  onSubmit: (data: Partial<PaymentReconciliationInvoice>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PaymentReconciliationInvoiceForm({ initialData = {}, onSubmit, mode, isLoading }: PaymentReconciliationInvoiceFormProps) {
  const form = useForm<Partial<PaymentReconciliationInvoice>>({
    resolver: zodResolver(PaymentReconciliationInvoiceInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Payment Reconciliation Invoice" : "New Payment Reconciliation Invoice"}
        </h2>
            <FormField control={form.control} name="invoice_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Invoice Type</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string} disabled>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Sales Invoice">Sales Invoice</SelectItem>
                    <SelectItem value="Purchase Invoice">Purchase Invoice</SelectItem>
                    <SelectItem value="Journal Entry">Journal Entry</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="invoice_number" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Invoice Number</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="invoice_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Invoice Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} disabled />
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
            <FormField control={form.control} name="outstanding_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Outstanding Amount</FormLabel>
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