"use client";

// Form for Repost Payment Ledger Items
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RepostPaymentLedgerItems } from "../types/repost-payment-ledger-items.js";
import { RepostPaymentLedgerItemsInsertSchema } from "../types/repost-payment-ledger-items.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface RepostPaymentLedgerItemsFormProps {
  initialData?: Partial<RepostPaymentLedgerItems>;
  onSubmit: (data: Partial<RepostPaymentLedgerItems>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function RepostPaymentLedgerItemsForm({ initialData = {}, onSubmit, mode, isLoading }: RepostPaymentLedgerItemsFormProps) {
  const form = useForm<Partial<RepostPaymentLedgerItems>>({
    resolver: zodResolver(RepostPaymentLedgerItemsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Repost Payment Ledger Items" : "New Repost Payment Ledger Items"}
        </h2>
            <FormField control={form.control} name="voucher_type" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Voucher Type (→ DocType)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search DocType..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="voucher_no" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Voucher No</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search..." {...f} value={(f.value as string) ?? ""} />
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