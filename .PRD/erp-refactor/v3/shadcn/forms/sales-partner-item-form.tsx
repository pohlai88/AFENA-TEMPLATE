"use client";

// Form for Sales Partner Item
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SalesPartnerItem } from "../types/sales-partner-item.js";
import { SalesPartnerItemInsertSchema } from "../types/sales-partner-item.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SalesPartnerItemFormProps {
  initialData?: Partial<SalesPartnerItem>;
  onSubmit: (data: Partial<SalesPartnerItem>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SalesPartnerItemForm({ initialData = {}, onSubmit, mode, isLoading }: SalesPartnerItemFormProps) {
  const form = useForm<Partial<SalesPartnerItem>>({
    resolver: zodResolver(SalesPartnerItemInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Sales Partner Item" : "New Sales Partner Item"}
        </h2>
            <FormField control={form.control} name="sales_partner" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Sales Partner  (→ Sales Partner)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Sales Partner..." {...f} value={(f.value as string) ?? ""} />
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