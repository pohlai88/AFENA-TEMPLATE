"use client";

// Form for Pricing Rule Brand
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PricingRuleBrand } from "../types/pricing-rule-brand.js";
import { PricingRuleBrandInsertSchema } from "../types/pricing-rule-brand.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PricingRuleBrandFormProps {
  initialData?: Partial<PricingRuleBrand>;
  onSubmit: (data: Partial<PricingRuleBrand>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PricingRuleBrandForm({ initialData = {}, onSubmit, mode, isLoading }: PricingRuleBrandFormProps) {
  const form = useForm<Partial<PricingRuleBrand>>({
    resolver: zodResolver(PricingRuleBrandInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Pricing Rule Brand" : "New Pricing Rule Brand"}
        </h2>
            {parent.apply_on === 'Item Code' && (
            <FormField control={form.control} name="brand" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Brand (→ Brand)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Brand..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            )}
            <FormField control={form.control} name="uom" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">UOM (→ UOM)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search UOM..." {...f} value={(f.value as string) ?? ""} />
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