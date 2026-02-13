"use client";

// Form for Pause SLA On Status
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PauseSlaOnStatus } from "../types/pause-sla-on-status.js";
import { PauseSlaOnStatusInsertSchema } from "../types/pause-sla-on-status.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface PauseSlaOnStatusFormProps {
  initialData?: Partial<PauseSlaOnStatus>;
  onSubmit: (data: Partial<PauseSlaOnStatus>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function PauseSlaOnStatusForm({ initialData = {}, onSubmit, mode, isLoading }: PauseSlaOnStatusFormProps) {
  const form = useForm<Partial<PauseSlaOnStatus>>({
    resolver: zodResolver(PauseSlaOnStatusInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Pause SLA On Status" : "New Pause SLA On Status"}
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