"use client";

// Form for Bank Transaction Payments
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BankTransactionPayments } from "../types/bank-transaction-payments.js";
import { BankTransactionPaymentsInsertSchema } from "../types/bank-transaction-payments.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface BankTransactionPaymentsFormProps {
  initialData?: Partial<BankTransactionPayments>;
  onSubmit: (data: Partial<BankTransactionPayments>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function BankTransactionPaymentsForm({ initialData = {}, onSubmit, mode, isLoading }: BankTransactionPaymentsFormProps) {
  const form = useForm<Partial<BankTransactionPayments>>({
    resolver: zodResolver(BankTransactionPaymentsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Bank Transaction Payments" : "New Bank Transaction Payments"}
        </h2>
            <FormField control={form.control} name="payment_document" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Payment Document (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="payment_entry" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Payment Entry</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="allocated_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Allocated Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {form.getValues().docstatus===1 && (
            <FormField control={form.control} name="clearance_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Clearance Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}