"use client";

// Form for Monthly Distribution
// Generated from Canon schema — do not edit manually

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { MonthlyDistribution } from "../types/monthly-distribution.js";
import { MonthlyDistributionInsertSchema } from "../types/monthly-distribution.js";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface MonthlyDistributionFormProps {
  initialData?: Partial<MonthlyDistribution>;
  onSubmit: (data: Partial<MonthlyDistribution>) => void;
  mode: "create" | "edit";
  isLoading?: boolean;
}

export function MonthlyDistributionForm({ initialData = {}, onSubmit, mode, isLoading }: MonthlyDistributionFormProps) {
  const form = useForm<Partial<MonthlyDistribution>>({
    resolver: zodResolver(MonthlyDistributionInsertSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === "edit" ? "Monthly Distribution" : "New Monthly Distribution"}
        </h2>
            <FormField control={form.control} name="distribution_id" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Distribution Name</FormLabel>
                <FormControl>
                  <Input type="text" {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormDescription>Name of the Monthly Distribution</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="fiscal_year" render={({ field: f }) => (
              <FormItem>
                <FormLabel className="">Fiscal Year (→ Fiscal Year)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Search Fiscal Year..." {...f} value={(f.value as string) ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="col-span-2">
              <FormLabel className="">Monthly Distribution Percentages</FormLabel>
              <div className="mt-1 border rounded-md p-4 text-sm text-muted-foreground">
                {/* Child table: Monthly Distribution Percentage — integrate with DataTable */}
                <p>Child table for Monthly Distribution Percentage</p>
              </div>
            </div>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}