"use client";

// Form for Customer Item
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CustomerItem } from "../types/customer-item.js";
import { CustomerItemInsertSchema } from "../types/customer-item.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CustomerItemFormProps {
  initialData?: Partial<CustomerItem>;
  onSubmit: (data: Partial<CustomerItem>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CustomerItemForm({ initialData = {}, onSubmit, mode, isLoading }: CustomerItemFormProps) {
  const form = useForm<Partial<CustomerItem>>({
    resolver: zodResolver(CustomerItemInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Customer Item" : "New Customer Item"}
        </h2>
            <FormField control={form.control} name="customer" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer  (→ Customer)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer..." {...f} value={(f.value as string) ?? ""} />
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