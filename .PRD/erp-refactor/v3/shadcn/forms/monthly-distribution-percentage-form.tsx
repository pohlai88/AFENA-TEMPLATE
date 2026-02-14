"use client";

// Form for Monthly Distribution Percentage
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { MonthlyDistributionPercentage } from "../types/monthly-distribution-percentage.js";
import { MonthlyDistributionPercentageInsertSchema } from "../types/monthly-distribution-percentage.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface MonthlyDistributionPercentageFormProps {
  initialData?: Partial<MonthlyDistributionPercentage>;
  onSubmit: (data: Partial<MonthlyDistributionPercentage>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function MonthlyDistributionPercentageForm({ initialData = {}, onSubmit, mode, isLoading }: MonthlyDistributionPercentageFormProps) {
  const form = useForm<Partial<MonthlyDistributionPercentage>>({
    resolver: zodResolver(MonthlyDistributionPercentageInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Monthly Distribution Percentage" : "New Monthly Distribution Percentage"}
        </h2>
            <FormField control={form.control} name="month" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Month</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="percentage_allocation" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Percentage Allocation</FormLabel>
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