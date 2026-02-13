"use client";

// Form for Budget Account
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BudgetAccount } from "../types/budget-account.js";
import { BudgetAccountInsertSchema } from "../types/budget-account.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface BudgetAccountFormProps {
  initialData?: Partial<BudgetAccount>;
  onSubmit: (data: Partial<BudgetAccount>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function BudgetAccountForm({ initialData = {}, onSubmit, mode, isLoading }: BudgetAccountFormProps) {
  const form = useForm<Partial<BudgetAccount>>({
    resolver: zodResolver(BudgetAccountInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Budget Account" : "New Budget Account"}
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
            <FormField control={form.control} name="budget_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Budget Amount</FormLabel>
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