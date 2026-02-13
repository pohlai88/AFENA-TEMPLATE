"use client";

// Form for Shipping Rule Condition
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ShippingRuleCondition } from "../types/shipping-rule-condition.js";
import { ShippingRuleConditionInsertSchema } from "../types/shipping-rule-condition.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ShippingRuleConditionFormProps {
  initialData?: Partial<ShippingRuleCondition>;
  onSubmit: (data: Partial<ShippingRuleCondition>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ShippingRuleConditionForm({ initialData = {}, onSubmit, mode, isLoading }: ShippingRuleConditionFormProps) {
  const form = useForm<Partial<ShippingRuleCondition>>({
    resolver: zodResolver(ShippingRuleConditionInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Shipping Rule Condition" : "New Shipping Rule Condition"}
        </h2>
            <FormField control={form.control} name="from_value" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">From Value</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="to_value" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">To Value</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="shipping_amount" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Shipping Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
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