"use client";

// Form for Item Customer Detail
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ItemCustomerDetail } from "../types/item-customer-detail.js";
import { ItemCustomerDetailInsertSchema } from "../types/item-customer-detail.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ItemCustomerDetailFormProps {
  initialData?: Partial<ItemCustomerDetail>;
  onSubmit: (data: Partial<ItemCustomerDetail>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ItemCustomerDetailForm({ initialData = {}, onSubmit, mode, isLoading }: ItemCustomerDetailFormProps) {
  const form = useForm<Partial<ItemCustomerDetail>>({
    resolver: zodResolver(ItemCustomerDetailInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Item Customer Detail" : "New Item Customer Detail"}
        </h2>
            <FormField control={form.control} name="customer_name" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Customer Name (→ Customer)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="customer_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="font-semibold">Customer Group (→ Customer Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Customer Group..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="ref_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Ref Code</FormLabel>
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