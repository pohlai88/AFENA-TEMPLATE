"use client";

// Form for Pricing Rule Detail
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PricingRuleDetail } from "../types/pricing-rule-detail.js";
import { PricingRuleDetailInsertSchema } from "../types/pricing-rule-detail.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface PricingRuleDetailFormProps {
  initialData?: Partial<PricingRuleDetail>;
  onSubmit: (data: Partial<PricingRuleDetail>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PricingRuleDetailForm({ initialData = {}, onSubmit, mode, isLoading }: PricingRuleDetailFormProps) {
  const form = useForm<Partial<PricingRuleDetail>>({
    resolver: zodResolver(PricingRuleDetailInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Pricing Rule Detail" : "New Pricing Rule Detail"}
        </h2>
            <FormField control={form.control} name="pricing_rule" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Pricing Rule (→ Pricing Rule)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Pricing Rule..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="item_code" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Item Code</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="rule_applied" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} disabled />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Rule Applied</FormLabel>
                </div>
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