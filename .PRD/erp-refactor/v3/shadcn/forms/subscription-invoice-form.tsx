"use client";

// Form for Subscription Invoice
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubscriptionInvoice } from "../types/subscription-invoice.js";
import { SubscriptionInvoiceInsertSchema } from "../types/subscription-invoice.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SubscriptionInvoiceFormProps {
  initialData?: Partial<SubscriptionInvoice>;
  onSubmit: (data: Partial<SubscriptionInvoice>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SubscriptionInvoiceForm({ initialData = {}, onSubmit, mode, isLoading }: SubscriptionInvoiceFormProps) {
  const form = useForm<Partial<SubscriptionInvoice>>({
    resolver: zodResolver(SubscriptionInvoiceInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Subscription Invoice" : "New Subscription Invoice"}
        </h2>
            <FormField control={form.control} name="document_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Document Type  (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="invoice" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Invoice</FormLabel>
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