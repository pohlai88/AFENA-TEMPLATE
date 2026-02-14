"use client";

// Form for Repost Accounting Ledger Items
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RepostAccountingLedgerItems } from "../types/repost-accounting-ledger-items.js";
import { RepostAccountingLedgerItemsInsertSchema } from "../types/repost-accounting-ledger-items.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface RepostAccountingLedgerItemsFormProps {
  initialData?: Partial<RepostAccountingLedgerItems>;
  onSubmit: (data: Partial<RepostAccountingLedgerItems>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function RepostAccountingLedgerItemsForm({ initialData = {}, onSubmit, mode, isLoading }: RepostAccountingLedgerItemsFormProps) {
  const form = useForm<Partial<RepostAccountingLedgerItems>>({
    resolver: zodResolver(RepostAccountingLedgerItemsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Repost Accounting Ledger Items" : "New Repost Accounting Ledger Items"}
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