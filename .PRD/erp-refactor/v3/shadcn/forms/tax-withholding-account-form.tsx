"use client";

// Form for Tax Withholding Account
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TaxWithholdingAccount } from "../types/tax-withholding-account.js";
import { TaxWithholdingAccountInsertSchema } from "../types/tax-withholding-account.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TaxWithholdingAccountFormProps {
  initialData?: Partial<TaxWithholdingAccount>;
  onSubmit: (data: Partial<TaxWithholdingAccount>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function TaxWithholdingAccountForm({ initialData = {}, onSubmit, mode, isLoading }: TaxWithholdingAccountFormProps) {
  const form = useForm<Partial<TaxWithholdingAccount>>({
    resolver: zodResolver(TaxWithholdingAccountInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Tax Withholding Account" : "New Tax Withholding Account"}
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
            <FormField control={form.control} name="account" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Account (→ Account)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Account..." {...f} value={(f.value as string) ?? ""} />
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