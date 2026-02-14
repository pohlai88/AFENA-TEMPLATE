"use client";

// Form for Payment Entry Reference
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PaymentEntryReference } from "../types/payment-entry-reference.js";
import { PaymentEntryReferenceInsertSchema } from "../types/payment-entry-reference.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PaymentEntryReferenceFormProps {
  initialData?: Partial<PaymentEntryReference>;
  onSubmit: (data: Partial<PaymentEntryReference>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PaymentEntryReferenceForm({ initialData = {}, onSubmit, mode, isLoading }: PaymentEntryReferenceFormProps) {
  const form = useForm<Partial<PaymentEntryReference>>({
    resolver: zodResolver(PaymentEntryReferenceInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Payment Entry Reference" : "New Payment Entry Reference"}
        </h2>
            <FormField control={form.control} name="reference_doctype" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Type (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="reference_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="due_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Due Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="bill_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier Invoice No</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="payment_term" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Payment Term (→ Payment Term)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Payment Term..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {!!form.getValues().payment_term && (
            <FormField control={form.control} name="payment_term_outstanding" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Payment Term Outstanding</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="account_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account Type</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="payment_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Payment Type</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="reconcile_effect_on" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Reconcile Effect On</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="total_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Grand Total</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="outstanding_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Outstanding</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="allocated_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Allocated</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {(form.getValues().reference_doctype==='Purchase Invoice') && (
            <FormField control={form.control} name="exchange_rate" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Exchange Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
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
            <FormField control={form.control} name="account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="payment_request" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Payment Request (→ Payment Request)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Payment Request..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().payment_request && form.getValues().payment_request_outstanding && (
            <FormField control={form.control} name="payment_request_outstanding" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Payment Request Outstanding</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="advance_voucher_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Advance Voucher Type (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="advance_voucher_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Advance Voucher No</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} disabled />
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