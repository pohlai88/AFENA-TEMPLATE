"use client";

// Form for Customer Number At Supplier
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CustomerNumberAtSupplier } from "../types/customer-number-at-supplier.js";
import { CustomerNumberAtSupplierInsertSchema } from "../types/customer-number-at-supplier.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CustomerNumberAtSupplierFormProps {
  initialData?: Partial<CustomerNumberAtSupplier>;
  onSubmit: (data: Partial<CustomerNumberAtSupplier>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CustomerNumberAtSupplierForm({ initialData = {}, onSubmit, mode, isLoading }: CustomerNumberAtSupplierFormProps) {
  const form = useForm<Partial<CustomerNumberAtSupplier>>({
    resolver: zodResolver(CustomerNumberAtSupplierInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Customer Number At Supplier" : "New Customer Number At Supplier"}
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
            <FormField control={form.control} name="customer_number" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer Number</FormLabel>
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