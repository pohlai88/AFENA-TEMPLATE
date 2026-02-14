"use client";

// Form for Process Subscription
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProcessSubscription } from "../types/process-subscription.js";
import { ProcessSubscriptionInsertSchema } from "../types/process-subscription.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ProcessSubscriptionFormProps {
  initialData?: Partial<ProcessSubscription>;
  onSubmit: (data: Partial<ProcessSubscription>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function ProcessSubscriptionForm({ initialData = {}, onSubmit, mode, isLoading }: ProcessSubscriptionFormProps) {
  const form = useForm<Partial<ProcessSubscription>>({
    resolver: zodResolver(ProcessSubscriptionInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Process Subscription" : "New Process Subscription"}
        </h2>
            <FormField control={form.control} name="posting_date" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Posting Date</FormLabel>
                <FormControl>
                  <Input type="date" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="subscription" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Subscription (→ Subscription)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Subscription..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="amended_from" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Amended From (→ Process Subscription)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Process Subscription..." {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
          {mode === "edit" && (initialData as any)?.docstatus === 0 && (
            <Button type="button" variant="outline" disabled={isLoading}>
              Submit
            </Button>
          )}
          {mode === "edit" && (initialData as any)?.docstatus === 1 && (
            <Button type="button" variant="destructive" disabled={isLoading}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}