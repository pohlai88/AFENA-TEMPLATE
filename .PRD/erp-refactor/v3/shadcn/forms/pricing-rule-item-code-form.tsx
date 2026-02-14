"use client";

// Form for Pricing Rule Item Code
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PricingRuleItemCode } from "../types/pricing-rule-item-code.js";
import { PricingRuleItemCodeInsertSchema } from "../types/pricing-rule-item-code.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PricingRuleItemCodeFormProps {
  initialData?: Partial<PricingRuleItemCode>;
  onSubmit: (data: Partial<PricingRuleItemCode>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PricingRuleItemCodeForm({ initialData = {}, onSubmit, mode, isLoading }: PricingRuleItemCodeFormProps) {
  const form = useForm<Partial<PricingRuleItemCode>>({
    resolver: zodResolver(PricingRuleItemCodeInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Pricing Rule Item Code" : "New Pricing Rule Item Code"}
        </h2>
            {parent.apply_on === 'Item Code' && (
            <FormField control={form.control} name="item_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Code (→ Item)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item..." {...f} value={(f.value as string) ?? ""} />
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