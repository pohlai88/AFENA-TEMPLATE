"use client";

// Form for Opportunity Lost Reason
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { OpportunityLostReason } from "../types/opportunity-lost-reason.js";
import { OpportunityLostReasonInsertSchema } from "../types/opportunity-lost-reason.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface OpportunityLostReasonFormProps {
  initialData?: Partial<OpportunityLostReason>;
  onSubmit: (data: Partial<OpportunityLostReason>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function OpportunityLostReasonForm({ initialData = {}, onSubmit, mode, isLoading }: OpportunityLostReasonFormProps) {
  const form = useForm<Partial<OpportunityLostReason>>({
    resolver: zodResolver(OpportunityLostReasonInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Opportunity Lost Reason" : "New Opportunity Lost Reason"}
        </h2>
            <FormField control={form.control} name="lost_reason" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Lost Reason</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
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