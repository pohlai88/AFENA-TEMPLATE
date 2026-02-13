"use client";

// Form for SLA Fulfilled On Status
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SlaFulfilledOnStatus } from "../types/sla-fulfilled-on-status.js";
import { SlaFulfilledOnStatusInsertSchema } from "../types/sla-fulfilled-on-status.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface SlaFulfilledOnStatusFormProps {
  initialData?: Partial<SlaFulfilledOnStatus>;
  onSubmit: (data: Partial<SlaFulfilledOnStatus>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function SlaFulfilledOnStatusForm({ initialData = {}, onSubmit, mode, isLoading }: SlaFulfilledOnStatusFormProps) {
  const form = useForm<Partial<SlaFulfilledOnStatus>>({
    resolver: zodResolver(SlaFulfilledOnStatusInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "SLA Fulfilled On Status" : "New SLA Fulfilled On Status"}
        </h2>
            <FormField control={form.control} name="status" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Status</FormLabel>
                <Select onValueChange={f.onChange} defaultValue={f.value as string}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  </SelectContent>
                </Select>
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