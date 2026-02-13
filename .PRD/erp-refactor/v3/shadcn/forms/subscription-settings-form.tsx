"use client";

// Form for Subscription Settings
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubscriptionSettings } from "../types/subscription-settings.js";
import { SubscriptionSettingsInsertSchema } from "../types/subscription-settings.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface SubscriptionSettingsFormProps {
  initialData?: Partial<SubscriptionSettings>;
  onSubmit: (data: Partial<SubscriptionSettings>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SubscriptionSettingsForm({ initialData = {}, onSubmit, mode, isLoading }: SubscriptionSettingsFormProps) {
  const form = useForm<Partial<SubscriptionSettings>>({
    resolver: zodResolver(SubscriptionSettingsInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Subscription Settings" : "New Subscription Settings"}
        </h2>
            <FormField control={form.control} name="grace_period" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Grace Period</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...f} value={f.value != null ? Number(f.value) : ""}
                    onChange={e => f.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                </FormControl>
                <FormDescription>Number of days after invoice date has elapsed before canceling subscription or marking subscription as unpaid</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="cancel_after_grace" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Cancel Subscription After Grace Period</FormLabel>
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="prorate" render={({ field: f }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={!!f.value} onCheckedChange={f.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="">Prorate</FormLabel>
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