"use client";

// Form for Customer Group Item
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CustomerGroupItem } from "../types/customer-group-item.js";
import { CustomerGroupItemInsertSchema } from "../types/customer-group-item.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CustomerGroupItemFormProps {
  initialData?: Partial<CustomerGroupItem>;
  onSubmit: (data: Partial<CustomerGroupItem>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CustomerGroupItemForm({ initialData = {}, onSubmit, mode, isLoading }: CustomerGroupItemFormProps) {
  const form = useForm<Partial<CustomerGroupItem>>({
    resolver: zodResolver(CustomerGroupItemInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Customer Group Item" : "New Customer Group Item"}
        </h2>
            <FormField control={form.control} name="customer_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Customer Group (→ Customer Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer Group..." {...f} value={(f.value as string) ?? ""} />
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