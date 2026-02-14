"use client";

// Form for Cost Center Allocation Percentage
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CostCenterAllocationPercentage } from "../types/cost-center-allocation-percentage.js";
import { CostCenterAllocationPercentageInsertSchema } from "../types/cost-center-allocation-percentage.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CostCenterAllocationPercentageFormProps {
  initialData?: Partial<CostCenterAllocationPercentage>;
  onSubmit: (data: Partial<CostCenterAllocationPercentage>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function CostCenterAllocationPercentageForm({ initialData = {}, onSubmit, mode, isLoading }: CostCenterAllocationPercentageFormProps) {
  const form = useForm<Partial<CostCenterAllocationPercentage>>({
    resolver: zodResolver(CostCenterAllocationPercentageInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Cost Center Allocation Percentage" : "New Cost Center Allocation Percentage"}
        </h2>
            <FormField control={form.control} name="cost_center" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Cost Center (→ Cost Center)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Cost Center..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="percentage" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Percentage (%)</FormLabel>
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