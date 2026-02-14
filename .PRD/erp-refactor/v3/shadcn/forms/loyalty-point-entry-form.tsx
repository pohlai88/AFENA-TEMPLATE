"use client";

// Form for Loyalty Point Entry
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoyaltyPointEntry } from "../types/loyalty-point-entry.js";
import { LoyaltyPointEntryInsertSchema } from "../types/loyalty-point-entry.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface LoyaltyPointEntryFormProps {
  initialData?: Partial<LoyaltyPointEntry>;
  onSubmit: (data: Partial<LoyaltyPointEntry>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function LoyaltyPointEntryForm({ initialData = {}, onSubmit, mode, isLoading }: LoyaltyPointEntryFormProps) {
  const form = useForm<Partial<LoyaltyPointEntry>>({
    resolver: zodResolver(LoyaltyPointEntryInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "edit" ? (initialData.customer as string) ?? "Loyalty Point Entry" : "New Loyalty Point Entry"}
          </h2>
        </div>
            <FormField control={form.control} name="loyalty_program" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Loyalty Program (→ Loyalty Program)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Loyalty Program..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="loyalty_program_tier" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Loyalty Program Tier</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="customer" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer (→ Customer)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="invoice_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Invoice Type (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="invoice" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Invoice</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="redeem_against" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Redeem Against (→ Loyalty Point Entry)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Loyalty Point Entry..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="loyalty_points" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Loyalty Points</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="purchase_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Purchase Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="expiry_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Expiry Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="posting_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Posting Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="discretionary_reason" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Discretionary Reason</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
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