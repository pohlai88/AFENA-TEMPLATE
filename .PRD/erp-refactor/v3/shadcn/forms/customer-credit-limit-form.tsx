"use client";

// Form for Customer Credit Limit
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CustomerCreditLimit } from "../types/customer-credit-limit.js";
import { CustomerCreditLimitInsertSchema } from "../types/customer-credit-limit.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface CustomerCreditLimitFormProps {
  initialData?: Partial<CustomerCreditLimit>;
  onSubmit: (data: Partial<CustomerCreditLimit>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CustomerCreditLimitForm({ initialData = {}, onSubmit, mode, isLoading }: CustomerCreditLimitFormProps) {
  const form = useForm<Partial<CustomerCreditLimit>>({
    resolver: zodResolver(CustomerCreditLimitInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Customer Credit Limit" : "New Customer Credit Limit"}
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
            <FormField control={form.control} name="credit_limit" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Credit Limit</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="bypass_credit_limit_check" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Bypass Credit Limit Check at Sales Order</FormLabel>
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