"use client";

// Form for Pricing Rule Item Group
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PricingRuleItemGroup } from "../types/pricing-rule-item-group.js";
import { PricingRuleItemGroupInsertSchema } from "../types/pricing-rule-item-group.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PricingRuleItemGroupFormProps {
  initialData?: Partial<PricingRuleItemGroup>;
  onSubmit: (data: Partial<PricingRuleItemGroup>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PricingRuleItemGroupForm({ initialData = {}, onSubmit, mode, isLoading }: PricingRuleItemGroupFormProps) {
  const form = useForm<Partial<PricingRuleItemGroup>>({
    resolver: zodResolver(PricingRuleItemGroupInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Pricing Rule Item Group" : "New Pricing Rule Item Group"}
        </h2>
            {parent.apply_on === 'Item Code' && (
            <FormField control={form.control} name="item_group" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Group (→ Item Group)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Item Group..." {...f} value={(f.value as string) ?? ""} />
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