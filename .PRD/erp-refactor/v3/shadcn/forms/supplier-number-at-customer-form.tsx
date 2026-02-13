"use client";

// Form for Supplier Number At Customer
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SupplierNumberAtCustomer } from "../types/supplier-number-at-customer.js";
import { SupplierNumberAtCustomerInsertSchema } from "../types/supplier-number-at-customer.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SupplierNumberAtCustomerFormProps {
  initialData?: Partial<SupplierNumberAtCustomer>;
  onSubmit: (data: Partial<SupplierNumberAtCustomer>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SupplierNumberAtCustomerForm({ initialData = {}, onSubmit, mode, isLoading }: SupplierNumberAtCustomerFormProps) {
  const form = useForm<Partial<SupplierNumberAtCustomer>>({
    resolver: zodResolver(SupplierNumberAtCustomerInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Supplier Number At Customer" : "New Supplier Number At Customer"}
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
            <FormField control={form.control} name="supplier_number" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Supplier Number</FormLabel>
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