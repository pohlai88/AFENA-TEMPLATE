"use client";

// Form for Mode of Payment Account
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ModeOfPaymentAccount } from "../types/mode-of-payment-account.js";
import { ModeOfPaymentAccountInsertSchema } from "../types/mode-of-payment-account.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ModeOfPaymentAccountFormProps {
  initialData?: Partial<ModeOfPaymentAccount>;
  onSubmit: (data: Partial<ModeOfPaymentAccount>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ModeOfPaymentAccountForm({ initialData = {}, onSubmit, mode, isLoading }: ModeOfPaymentAccountFormProps) {
  const form = useForm<Partial<ModeOfPaymentAccount>>({
    resolver: zodResolver(ModeOfPaymentAccountInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Mode of Payment Account" : "New Mode of Payment Account"}
        </h2>
            <FormField control={form.control} name="company" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Company (→ Company)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Company..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="default_account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Default Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Default account will be automatically updated in POS Invoice when this mode is selected.</FormDescription>
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