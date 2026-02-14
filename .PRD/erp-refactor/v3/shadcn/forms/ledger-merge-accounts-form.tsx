"use client";

// Form for Ledger Merge Accounts
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LedgerMergeAccounts } from "../types/ledger-merge-accounts.js";
import { LedgerMergeAccountsInsertSchema } from "../types/ledger-merge-accounts.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface LedgerMergeAccountsFormProps {
  initialData?: Partial<LedgerMergeAccounts>;
  onSubmit: (data: Partial<LedgerMergeAccounts>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function LedgerMergeAccountsForm({ initialData = {}, onSubmit, mode, isLoading }: LedgerMergeAccountsFormProps) {
  const form = useForm<Partial<LedgerMergeAccounts>>({
    resolver: zodResolver(LedgerMergeAccountsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Ledger Merge Accounts" : "New Ledger Merge Accounts"}
        </h2>
            <FormField control={form.control} name="account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="account_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="merged" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Merged</FormLabel>
                </div>
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