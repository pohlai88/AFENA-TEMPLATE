"use client";

// Form for Shipping Rule Country
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ShippingRuleCountry } from "../types/shipping-rule-country.js";
import { ShippingRuleCountryInsertSchema } from "../types/shipping-rule-country.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ShippingRuleCountryFormProps {
  initialData?: Partial<ShippingRuleCountry>;
  onSubmit: (data: Partial<ShippingRuleCountry>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ShippingRuleCountryForm({ initialData = {}, onSubmit, mode, isLoading }: ShippingRuleCountryFormProps) {
  const form = useForm<Partial<ShippingRuleCountry>>({
    resolver: zodResolver(ShippingRuleCountryInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Shipping Rule Country" : "New Shipping Rule Country"}
        </h2>
            <FormField control={form.control} name="country" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Country (→ Country)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Country..." {...f} value={(f.value as string) ?? ""} />
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