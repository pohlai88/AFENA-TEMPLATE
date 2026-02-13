"use client";

// Form for Subscription Plan Detail
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubscriptionPlanDetail } from "../types/subscription-plan-detail.js";
import { SubscriptionPlanDetailInsertSchema } from "../types/subscription-plan-detail.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SubscriptionPlanDetailFormProps {
  initialData?: Partial<SubscriptionPlanDetail>;
  onSubmit: (data: Partial<SubscriptionPlanDetail>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SubscriptionPlanDetailForm({ initialData = {}, onSubmit, mode, isLoading }: SubscriptionPlanDetailFormProps) {
  const form = useForm<Partial<SubscriptionPlanDetail>>({
    resolver: zodResolver(SubscriptionPlanDetailInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Subscription Plan Detail" : "New Subscription Plan Detail"}
        </h2>
            <FormField control={form.control} name="plan" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Plan (→ Subscription Plan)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Subscription Plan..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="qty" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Quantity</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
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