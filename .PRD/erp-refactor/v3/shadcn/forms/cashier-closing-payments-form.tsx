"use client";

// Form for Cashier Closing Payments
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CashierClosingPayments } from "../types/cashier-closing-payments.js";
import { CashierClosingPaymentsInsertSchema } from "../types/cashier-closing-payments.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CashierClosingPaymentsFormProps {
  initialData?: Partial<CashierClosingPayments>;
  onSubmit: (data: Partial<CashierClosingPayments>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CashierClosingPaymentsForm({ initialData = {}, onSubmit, mode, isLoading }: CashierClosingPaymentsFormProps) {
  const form = useForm<Partial<CashierClosingPayments>>({
    resolver: zodResolver(CashierClosingPaymentsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Cashier Closing Payments" : "New Cashier Closing Payments"}
        </h2>
            <FormField control={form.control} name="mode_of_payment" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Mode of Payment (→ Mode of Payment)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Mode of Payment..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amount</FormLabel>
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